import { Axios } from 'axios'
import { ENDPOINTS } from '../api/axios'
import Service from './service'
import { Market } from '../interfaces/market'

export default class MarketService extends Service {
	constructor(axios: Axios) {
		super(axios)
	}

	async findAll() {
		return await this.axios.get<Market[]>(`${ENDPOINTS.MARKET}/all`)
	}
}
