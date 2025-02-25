import { Axios } from 'axios'
import { ENDPOINTS } from '../api/axios'
import Service from './service'
import { MarketProduct } from '../interfaces/market-product'

export default class MarketProductService extends Service {
	constructor(axios: Axios) {
		super(axios)
	}

	async findAll(product: string, markets: string[]) {
		return await this.axios.get<MarketProduct[]>(`${ENDPOINTS.MARKET_PRODUCT}/all`, {
			params: { product: product, markets: markets.join(',') }
		})
	}
}
