import { ElementHandle } from "puppeteer"
import { parseNumber, xpath } from "../../common/utils"
import { Logger } from "../../models/logger"
import { Product } from "../../models/product/product"
import { MarketScraper } from "../../models/scraper/market-scraper"

export class UnidosScraper extends MarketScraper {

  constructor() {
    super({
      market: { name: 'Unidos', website: 'https://www.supermercadosunidos.com.br' },
      logger: new Logger("Unidos Scraper")
    })
    this.constructor.name
  }

  protected override async _start() {
    const page = await this.browser!.newPage()
    const [res] = await Promise.all([
      page.goto(this.market.website),
      this.logger.info(`Acessando o site ${this.market.website}`)
    ])
    if (res && res.status() !== 200) {
      this.logger.error(`Error: ${res.status()} ${res.statusText()}`)
      return
    }
    const XPATHS = {
      popup_reject: xpath('//*[@id="onloadModal"]//*[@class="btn-close"]'),
      products: xpath('//*[contains(@class, "product-cart-wrap")]'),
      validate: xpath('//*[@data-countdown]'),
    }
    const $dateTime = await page.waitForSelector(XPATHS.validate, { timeout: 10000 })
    const dateTime = await $dateTime!.evaluate(el => el.getAttribute("data-countdown")!)
    await page.waitForSelector(XPATHS.products, { timeout: 10000 })
    const $products = await page.$$(XPATHS.products)
    const [date, time] = dateTime.split(" ")
    const callbackProduct = async (p: Product) => {
      p.offers?.forEach(o => {
        o.endDate = new Date(date.replace("/", "-").concat(` ${time}`))
      })
      return p
    }
    for (let i = 0; i < $products.length; i++) {
      const product = await this.getProduct($products[i], callbackProduct)
      if (!product) continue
      await this.addProduct(product)
    }
  }

  protected override async afterAddProduct(product: Product): Promise<void> {
    this.logger.info(`Produto: ${product.name} | Preço: ${product.price}`)
  }

  private async getProduct(el: ElementHandle<Element>, callback: (p: Product) => Promise<Product> = async p => p): Promise<Product | undefined> {
    const XPATHS = {
      name: xpath('.//h2'),
      price: xpath('.//*[@class="product-price"]//span'),
      offer_price: xpath('.//*[@class="product-price"]//span'),
    }
    const name = await el.$eval(XPATHS.name, el => el.textContent!.trim())
    const $price = await el.$(XPATHS.price)
    const price = await $price?.evaluate(el => el.textContent!.match(/\d+(?:,\d{2})?/g)![0])
    const offer_price = await el.$eval(XPATHS.offer_price, el => el.textContent!.match(/\d+(?:,\d{2})?/g)![0])
    const brand = undefined //TODO: pegar a marca
    const weight = undefined //TODO: pegar o peso
    return callback({
      brand,
      name,
      active: true,
      price: parseNumber(price || offer_price),
      offers: [{
        price: parseNumber(offer_price),
      }]
    })
  }
}