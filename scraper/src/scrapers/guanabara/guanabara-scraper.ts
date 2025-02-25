import { UnitMeasure } from "../../common/enums/unit-measure"
import { normalize, parseNumber, xpath } from "../../common/utils"
import { Logger } from "../../models/logger"
import { Product } from "../../models/product/product"
import { MarketScraper } from "../../models/scraper/market-scraper"

export class GuanabaraScraper extends MarketScraper {

  constructor() {
    super({
      logger: new Logger("Guanabara Scraper"),
      market: { name: 'Guanabara', website: 'https://www.supermercadosguanabara.com.br' }
    })
  }

  protected override async _start() {
    const page = await this.browser!.newPage()
    const [res] = await Promise.all([
      page.goto(this.market.website + '/produtos'),
      this.logger.info(`Acessando o site ${this.market.website + '/produtos'}`)
    ])
    if (res && res.status() !== 200) {
      this.logger.error(`Error: ${res.status()} ${res.statusText()}`)
      return
    }
    const XPATHS_categories = xpath('//a[@class="item"]')
    const $categories = await page.$$(XPATHS_categories)
    for (const $category of $categories) {
      const href = await $category.evaluate(el => el.getAttribute('href')!)
      if (!href) continue
      const products = await this.getProducts(this.market.website + href)
      const category = await $category.evaluate(el => el.textContent!.toLowerCase().trim())
      if (products) {
        this.logger.info(`Total de produtos na categoria "${category}": ${products.length}`)
        await this.addProduct(...products)
      } else {
        this.logger.info(`Não foi possível obter os produtos da categoria "${category}"`)
        return
      }
    }
  }

  protected override async afterAddProduct(product: Product): Promise<void> {
    this.logger.info(`Produto: ${product.name} | Preço: ${product.price}`)
  }

  private async getProducts(href: string): Promise<Product[] | undefined> {
    const XPATHS = {
      container: xpath('//div[@class="products-list"]'),
      products: xpath('.//div[@class="row"]'),
      price: xpath('.//*[@class="number"]'),
      name: xpath('.//*[@class="name"]'),
      validate: xpath('//*[@class="validate"]/p')
    }
    const page = await this.browser!.newPage()
    try {
      const products: Product[] = []
      await page.goto(href)
      const $productList = await page.waitForSelector(XPATHS.container, { timeout: 10000 })
      if (!$productList) throw new Error("Não foi possível obter a lista de produtos")
      const $products = await $productList.$$(XPATHS.products)
      const endDate = await page.$eval(XPATHS.validate, el => {
        const text = el.textContent?.trim()
        if (!text) return
        const match = text.match(/(\d{2})\/(\d{2})\/(\d{4})/)
        if (!match) return
        return match[0].split("/").reverse().join("-").concat(" 23:59:59")
      })
      for (const $product of $products) {
        const name = await $product.$eval(XPATHS.name, el => el.textContent!.trim().replace(/(\s)+/g, ' '))
        const price = await $product.$eval(XPATHS.price, el => el.textContent!.trim().replace(/(\s)+/g, ' '))
        const normalizedName = normalize(name).toLowerCase();
        const match = normalizedName.match(/\b(kg|g)\b/i)
        const IGNORE_WORDS = [/\bbandeja\b/gi, /\bpct\b/gi]
        !IGNORE_WORDS.some(w => w.test(normalizedName))
        const unitMeasure = match && !IGNORE_WORDS.some(w => w.test(normalizedName)) ? match[0] : UnitMeasure.UN
        products.push(
          {
            // brand, //TODO: pegar a marca
            unitMeasure: unitMeasure as UnitMeasure,
            name,
            price: parseNumber(price),
            active: true,
            offers: [{
              price: parseNumber(price),
              endDate: endDate ? new Date(endDate) : undefined
            }]
          }
        )
      }
      return products
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message)
      } else {
        console.log(error)
      }
    } finally {
      await page.close()
    }
  }
}