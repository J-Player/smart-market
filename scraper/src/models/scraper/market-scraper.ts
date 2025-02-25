import { saveObjectToJsonFile } from "../../common/utils"
import { Market } from "../market/market"
import { Product } from "../product/product"
import { Scraper, ScraperProps } from "./scraper"
import { MarketScraperPayload } from "./market-scraper-payload"
import { ScraperEvent } from "../../events/scraper-event"

export interface MarketScraperProps extends ScraperProps {
  readonly market: Market
}

export abstract class MarketScraper extends Scraper {
  readonly scraperPayload: MarketScraperPayload

  constructor(protected props: MarketScraperProps) {
    super(props)
    this.scraperPayload = new MarketScraperPayload(props.market, [])
    this.emitter.on(ScraperEvent.SCRAPER_RESETED, (scraper: MarketScraper) => scraper.scraperPayload.products = [])
  }

  get payload(): MarketScraperPayload {
    return this.scraperPayload
  }

  get productLength(): number {
    return this.scraperPayload.products.length
  }

  get market(): Market {
    return this.props.market
  }

  protected async beforeAddProduct(product: Product): Promise<void> { }
  protected async afterAddProduct(product: Product): Promise<void> { }

  async addProduct(...products: Product[]) {
    for (const product of products) {
      await this.beforeAddProduct(product)
      this.scraperPayload.products.push(product)
      await this.afterAddProduct(product)
    }
  }

  protected override async beforeStop(): Promise<void> {
    this.logger.info(`Total de produtos: ${this.productLength}`)
    if (this.productLength > 0) this.removeDuplicates()
  }

  private removeDuplicates() {
    const filterProducts = this.scraperPayload.products.reduce((acc: Map<string, Product>, product: Product) => {
      if (!acc.has(product.name.toLocaleUpperCase())) acc.set(product.name.toLocaleUpperCase(), product);
      return acc;
    }, new Map<string, Product>())
    const duplicates = this.scraperPayload.products.length - filterProducts.size
    if (duplicates > 0) {
      this.logger.debug(`Produtos duplicados removidos: ${duplicates}`)
      this.scraperPayload.products = Array.from(filterProducts.values())
    }
  }

}