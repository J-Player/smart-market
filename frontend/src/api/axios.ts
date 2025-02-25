import axios from 'axios'

const BASE_URL = import.meta.env.API_URL

export enum ENDPOINTS {
	MARKET = '/markets',
	PRODUCT = '/products',
	MARKET_PRODUCT = '/market-products',
	USER = '/users',
	AUTH = '/auth'
}

export default axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' }
})

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true
})
