import { MarketProduct } from '../interfaces/market-product'
import { Product } from '../models/product'

export abstract class ProductMapper {
	static toDomain(dto: MarketProduct): Product {
		return new Product({
			id: dto.id,
			brand: dto.brand,
			name: dto.name,
			market: dto.market,
			url: dto.url,
			unitMeasure: dto.unitMeasure,
			active: dto.active,
			offers: dto.offers,
			price: dto.price
		})
	}
}
