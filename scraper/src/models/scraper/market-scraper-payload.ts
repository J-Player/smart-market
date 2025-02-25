import { Market } from "../market/market";
import { Product } from "../product/product";

export class MarketScraperPayload {
  constructor(public readonly market: Market, public products: Product[]) {}
}