import { Axios } from 'axios'
import { ENDPOINTS } from '../api/axios'
import { Product } from '../interfaces/product'
import Service from './service'

export default class ProductService extends Service {
	constructor(axios: Axios) {
		super(axios)
	}

	async findAll() {
		return await this.axios.get<Product[]>(`${ENDPOINTS.PRODUCT}/all`)
	}
}
