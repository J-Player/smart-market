import { ElementHandle } from "puppeteer"
import { UnitMeasure } from "../../common/enums/unit-measure"
import { parseNumber, sleep, xpath } from "../../common/utils"
import { Logger } from "../../models/logger"
import { Offer } from "../../models/offer/offer"
import { Product } from "../../models/product/product"
import { MarketScraper } from "../../models/scraper/market-scraper"
import { PrezunicOfferType } from "./enums/prezunic-offer-type"
import { PrezunicPromotion } from "./types/prezunic-promotion"
import { PrezunicScriptData } from "./types/prezunic-script-data"

export class PrezunicScraper extends MarketScraper {

  constructor() {
    super({
      logger: new Logger("Prezunic Scraper"),
      market: { name: 'Prezunic', website: 'https://www.prezunic.com.br' }
    })
  }

  protected override async _start() {
    const page = await this.browser!.newPage()
    const URL = `${this.market.website}/1479`
    const URL_QUERIES = 'map=productClusterIds&order=OrderByTopSaleDESC'
    const [res] = await Promise.all([
      page.goto([URL, URL_QUERIES].join('?')),
      this.logger.info(`Acessando o site: ${URL}?${URL_QUERIES}`)
    ])
    if (res && res.status() !== 200) {
      this.logger.error(`Error: ${res.status()} ${res.statusText()}`)
      return
    }
    const XPATHS = {
      popup: xpath('//*[@id="onetrust-reject-all-handler"]'),
      pagination: xpath('//*[contains(@class, "text_pagination")] | //*[contains(@class, "showingPages")]'),
      button_show_more: xpath('//*[contains(@class, "buttonShowMore")]//button'),
      gallery_container: xpath('//div[@id="gallery-layout-container"]'),
    }
    const [$popup] = await Promise.all([
      page.waitForSelector(XPATHS.popup, { timeout: 5000 }),
      this.logger.debug('Aguardando popup...'),
    ])
    if ($popup) {
      await Promise.all([
        $popup.click(),
        this.logger.debug('Popup fechado'),
      ]);
    }
    const $pagination = await page.waitForSelector(XPATHS.pagination, { timeout: 10000 })
    const pagination = await $pagination!.evaluate(el => el.textContent)
    const total = Number(pagination!.split(/\s/).at(-1))
    for (let i = 1; i <= total; i++) {
      this.logger.info(`Página ${i} de ${total}`)
      await page.keyboard.press("End") // Scroll para baixo
      const $productGallery = await page.waitForSelector(XPATHS.gallery_container, { timeout: 10000 })
      const products = await $productGallery!.$$(xpath('.//a'))
      for (let j = this.productLength; j < products.length; j++) {
        let product = await this.getProduct(products[j])
        if (product) {
          await this.addProduct(product)
          this.logger.info(`[${j + 1} de ${products.length}] Produto: ${product.name} - ${product.url}`)
        } else {
          this.logger.warn(`[${j + 1} de ${products.length}] Produto não encontrado`)
          continue
        }
      }
      const buttonShowMore = await page.waitForSelector(XPATHS.button_show_more, { timeout: 10000 })
      await Promise.all([
        page.waitForNavigation(),
        buttonShowMore!.click(),
      ]);
      await page.keyboard.press("Home") // Scroll para cima
      if (i !== total) {
        this.logger.debug('Carregando próxima página...')
        await page.waitForSelector(XPATHS.button_show_more, { timeout: 10000 })
        await sleep(1000)
      }
    }
  }

  private async getProduct(element: ElementHandle<Element>): Promise<Product | undefined> {
    const XPATHS = {
      script_data: xpath('//body//script[@type="application/ld+json"]'),
      out_stock: xpath('.//*[contains(@class, "Unavailable")]'),
      product_name: xpath('.//h3[contains(@class, "ProductName")]'),
      product_price: xpath('.//*[contains(@class, "currencyContainer--summary")]//span[contains(@class, "currencyContainer")]'),
      price_weight: xpath('.//*[contains(@class, "ProductWeight")]'),
      offer_club: xpath('.//*[contains(@class, "ClubOfferFlag")]'),
      offer_special: xpath('.//*[contains(@class, "crmPrice")] | .//*[contains(@class, "crmPrime")]'),
      offer_leve_mais_pague_menos: xpath('.//*[contains(@class, "promotionFlagsLabel")]'),
    }

    const url = this.market.website + (await element.evaluate(el => el.getAttribute('href')!))
    const scriptData = await element.$eval(XPATHS.script_data, el => JSON.parse(el.textContent!) as PrezunicScriptData)
    const name = await element.$eval(XPATHS.product_name, el => el.textContent!)
    const item = scriptData.itemListElement.map(i => i.item).find(item => item["@id"].endsWith(url))
    if (!item) throw new Error("Item not found in Script Data: " + name)
    const brand = item.brand?.name !== "Sem Marca" ? item.brand?.name : undefined

    const $out_stock = await element.$(XPATHS.out_stock)
    if ($out_stock) return { brand, name, url, active: false }

    const $weight = await element.$(XPATHS.price_weight)
    const weight = await $weight?.evaluate(el => {
      const weight = el.textContent
      const matches = weight?.match(/\(Aprox. (\d+)(g|kg)\)/)
      const value = matches![1]
      const unitMeasure = matches![2]
      return { value, unitMeasure }
    })

    const convertPriceToKg = (price: number, value: number, unitMeasure: string) => {
      switch (unitMeasure) {
        case UnitMeasure.KG:
          return price * (1 / value)
        case UnitMeasure.G:
          return price * (1000 / value)
        default:
          throw new Error("Invalid Unit Measure: " + unitMeasure)
      }
    }

    const prices = await element.$$eval(XPATHS.product_price, el => el.map(el => {
      const price = el.textContent!.match(/\d+(?:,\d{2})?/g)![0]
      return price
    })).then(p => p.map(parseNumber))
    const originalPrice = weight ? convertPriceToKg(prices[0], parseNumber(weight.value), weight.unitMeasure) : prices[0]
    const discountPrice = prices.length > 2 ? prices[2] : prices[1]

    const offers: Offer[] = []
    const $offer_club = await element.$(XPATHS.offer_club)

    if (originalPrice !== 0) {
      offers.push({
        type: $offer_club ? PrezunicOfferType.CLUBE : undefined,
        price: discountPrice,
      })
    }

    const $offer_leve_mais_pague_menos = await element.$(XPATHS.offer_leve_mais_pague_menos)
    if ($offer_leve_mais_pague_menos) {
      const leve_mais_pague_menos = await $offer_leve_mais_pague_menos.evaluate(el => el.textContent?.trim()!)
      offers.push({
        type: PrezunicOfferType.LEVE_MAIS_PAGUE_MENOS,
        rule: {
          unitMeasure: $weight ? UnitMeasure.KG : UnitMeasure.UN,
          minQuantity: parseNumber(leve_mais_pague_menos.split(/\s/)[1]),
          chargedQuantity: parseNumber(leve_mais_pague_menos.split(/\s/)[3]),
        }
      })
    }

    const $offer_special = await element.$(XPATHS.offer_special)
    if ($offer_special) {
      const specialOffer = await this.getSpecialOffer(url)
      if (specialOffer) offers.push(specialOffer)
    }

    if (offers.length > 0) {
      const specialOffers = [PrezunicOfferType.APP, PrezunicOfferType.PRIME].map(o => o.valueOf())
      const hasSpecialOffer = offers.some(o => o.type && specialOffers.includes(o.type))
      if (hasSpecialOffer) {
        const promotions = await element.evaluate(() => JSON.parse(localStorage.getItem('promotions')!) as PrezunicPromotion[])
        const itemPromotion = promotions.find(p => p.Ean === item?.mpn)
        if (!itemPromotion) throw new Error("Item with offers, but not found in LocalStorage Promotions: " + name)
        console.log(itemPromotion.Regras)
        const convertDate = (str: string) => str.split('/').reverse().join('-')
        offers.filter(o => o.type && specialOffers.includes(o.type)).forEach(o => {
          o.startDate = new Date(convertDate(itemPromotion.Regras.DataInicial).concat(" 00:00:00"))
          o.endDate = new Date(convertDate(itemPromotion.Regras.DataFinal).concat(" 23:59:59"))
        })
      }
    }

    return {
      brand,
      name,
      url,
      price: originalPrice === 0 ? discountPrice : originalPrice,
      active: $out_stock === null,
      unitMeasure: $weight ? UnitMeasure.KG : UnitMeasure.UN,
      offers: offers.length > 0 ? offers : undefined
    }
  }

  private async getSpecialOffer(href: string): Promise<Offer | undefined> {
    const XPATHS = {
      prices: xpath('//*[contains(@class, "currencyContainer--summary")]//span[contains(@class, "currencyContainer")]'),
      offer_club: xpath('//*[contains(@class, "ClubOfferFlag")]'),
      offer_app: xpath('//*[contains(@class, "crmPrice")]'),
      offer_prime: xpath('//*[contains(@class, "CrmPrime")]'),
      offer_app_or_prime_price: xpath('//*[contains(@class, "crmDiscount")]'),
    }
    const page = await this.browser!.newPage()
    try {
      const res = await page.goto(href)
      if (!res || res.status() !== 200) return
      const $offers = await page.waitForSelector(XPATHS.offer_app, { timeout: 5000 })
      const isOfferPrime = await $offers!.$(XPATHS.offer_prime)
      const priceOfferSpecial = await $offers!.$eval(XPATHS.offer_app_or_prime_price, el => el.textContent!)
      const maxQuantity = await $offers!.$eval(xpath('//b'), el => el.textContent!)
      return {
        type: isOfferPrime ? PrezunicOfferType.PRIME : PrezunicOfferType.APP,
        price: parseNumber(priceOfferSpecial.split(/\s/)[1]),
        rule: {
          unitMeasure: maxQuantity.toLowerCase().split(/\s/)[2] == "unidades" ? UnitMeasure.UN : UnitMeasure.KG,
          maxQuantity: parseNumber(maxQuantity.split(/\s/)[1]),
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      await page.close()
    }
  }

}