import { ElementHandle } from "puppeteer"
import { UnitMeasure } from "../../common/enums/unit-measure"
import { parseNumber, sleep, xpath } from "../../common/utils"
import { Logger } from "../../models/logger"
import { Offer } from "../../models/offer/offer"
import { Product } from "../../models/product/product"
import { MarketScraper } from "../../models/scraper/market-scraper"
import { MundialOfferType } from "./enums/mundial-offer-type"

export class MundialScraper extends MarketScraper {


  constructor() {
    super({
      logger: new Logger("Mundial Scraper"),
      market: { name: 'Mundial', website: 'https://www.supermercadosmundial.com.br' }
    })
  }

  protected override async _start() {
    const XPATHS = {
      popup_reject: xpath('//*[@data-cookiefirst-action="reject"]'),
      show_more: xpath('//*[@id="bnt-carregar"]'),
      container: xpath('//div[@class="products-list"]'),
      products: xpath('//div[contains(@class, "product")]'),
      offer_start_date: xpath('//*[@id="titleOffer"]'),
    }
    const page = await this.browser!.newPage()
    const URL = `${this.market.website}/ofertas`
    const [res] = await Promise.all([
      page.goto(URL),
      this.logger.info(`Acessando o site ${URL}`)
    ])
    if (res && res.status() !== 200) {
      this.logger.error(`Error: ${res.status()} ${res.statusText()}`)
      return
    }
    const isVisible = async (el: ElementHandle<Element>) => {
      return await el.evaluate(el => {
        const style = window.getComputedStyle(el)
        const display = style.display
        return display !== 'none'
      })
    }
    const isDisabled = async (el: ElementHandle<Element>) => {
      return await el.evaluate(el => el.hasAttribute('disabled'))
    }
    const $popup_reject = await page.waitForSelector(XPATHS.popup_reject, { timeout: 5000 })
    await Promise.all([
      $popup_reject?.click(),
      this.logger.debug(`Rejeitando cookies...`)
    ])
    let count = 1
    await sleep(5000) //pequeno delay antes de continuar
    const offerStartDate = await page.$eval(XPATHS.offer_start_date, el => {
      const text = el.textContent?.trim()
      if (!text) return
      const match = text.match(/(\d{2})\/(\d{2})\/(\d{4})/)?.map(Number)
      if (!match) return
      const dateFormatted = `${match[3]}-${match[2]}-${match[1]} 00:00:00`
      return dateFormatted
    })
    const callbackProduct = async (product: Product) => {
      if (product.offers) {
        for (let i = 0; i < product.offers.length; i++) {
          product.offers[i].startDate = offerStartDate ? new Date(offerStartDate) : undefined
        }
      }
      return product
    }
    do {
      const $products = await page.$$(XPATHS.products)
      for (let i = this.productLength; i < $products.length; i++) {
        const product = await this.getProduct($products[i], callbackProduct)
        if (!product) continue
        this.logger.info(`[${i + 1} de ${$products.length}] Adicionando produto: ${product.name}`)
        await this.addProduct(product)
      }
      const $button_show_more = await page.waitForSelector(XPATHS.show_more, { timeout: 5000 })
      if ($button_show_more && await isVisible($button_show_more)) {
        await Promise.all([
          $button_show_more.click(),
          this.logger.debug(`[${count++}] Carregando mais produtos...`)
        ])
        const isVisibleAndDisable = async () => {
          const [visible, disabled] = await Promise.all([isVisible($button_show_more), isDisabled($button_show_more)])
          return visible && disabled
        }
        while (await isVisibleAndDisable()) {
          await Promise.all([
            sleep(1000),
            this.logger.debug(`Esperando o botão ser habilitado novamente...`)
          ])
        }
      } else break
    } while (true)
  }

  protected override async afterAddProduct(product: Product): Promise<void> {
    this.logger.info(`Produto: ${product.name} | Preço: ${product.price}`)
  }

  private async getProduct(el: ElementHandle<Element>, callback: (p: Product) => Promise<Product> = async p => p): Promise<Product | undefined> {
    const XPATHS = {
      name: xpath('.//*[@class="name-product"]'),
      price: xpath('.//*[@id="dePriceStyle"]'),
      offer_price: xpath('.//*[@id="porStylePrice"]'),
      offer_end_date: xpath('.//*[@class="informationsProduct"]'),
      promotion: xpath('.//*[@class="promocao"]'),
    }
    const name = await el.$eval(XPATHS.name, el => el.textContent!.trim()!)
    const $price = await el.$(XPATHS.price)
    const price = await $price?.evaluate(el => el.textContent?.match(/\d+(?:,\d{2})?/g)?.[0])
    const offerPrice = await el.$eval(XPATHS.offer_price, el => el.textContent?.match(/\d+(?:,\d{2})?/g)!.at(0)!)
    const offerEndDate = await el.$eval(XPATHS.offer_end_date, el => {
      const text = el.textContent?.trim()
      if (!text) return
      const match = text.match(/(\d{2})\/(\d{2})\/(\d{4})/)?.map(Number)
      if (!match) return
      const dateFormatted = `${match[3]}-${match[2]}-${match[1]} 23:59:59`
      return dateFormatted
    })

    let offer: Offer = {
      price: parseNumber(offerPrice),
      endDate: offerEndDate ? new Date(offerEndDate) : undefined
    }

    const promotions = new Map<string, RegExp>()
    const { LEVE_MAIS_PAGUE_MENOS, MEU_MUNDIAL } = MundialOfferType
    promotions.set(LEVE_MAIS_PAGUE_MENOS, /(?:leve|pague)\s+(\d+)/gi)
    promotions.set(MEU_MUNDIAL, /\d+%\s+DE\s+DESCONTO\s+NA\s+UNIDADE/gi)
    const $promotion = await el.$(XPATHS.promotion)

    if ($promotion) {
      const promotionEntries = Array.from(promotions.entries());
      for (let i = 0; i < promotionEntries.length; i++) {
        const [key, value] = promotionEntries[i];
        const match = name.match(value)
        if (!match && i < promotionEntries.length - 1) continue
        else if (!match) {
          await this.printAndThrowError(el, {
            message: 'Promoção desconhecida do produto: ' + name,
            imageName: 'promotion-unknown'
          })
          return
        }
        const promotion = await $promotion.evaluate(el => el.textContent?.match(/\d+(?:,\d{2})?/g)?.[0]!)
        offer = {
          ...offer,
          type: key,
          price: parseNumber(promotion),
          rule: key === LEVE_MAIS_PAGUE_MENOS ? {
            unitMeasure: UnitMeasure.UN,
            minQuantity: parseInt(match[0].split(' ').pop()!),
            chargedQuantity: parseInt(match[1].split(' ').pop()!),
          } : undefined
        }
        break
      }
    }
    return callback({
      name,
      active: true,
      price: price ? parseNumber(price) : parseNumber(offerPrice),
      offers: offer ? [offer] : undefined,
    })
  }

  private async printAndThrowError(el: ElementHandle<Element>, options: { message: string, imageName: string }) {
    await el.scrollIntoView()
    await el.screenshot({ path: options.imageName.concat("-ERROR.png") })
    throw new Error(options.message)
  }

}