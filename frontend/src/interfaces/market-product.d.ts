import { Offer } from './offer'

export interface MarketProduct {
	readonly id: string
	readonly brand?: string
	readonly name: string
	readonly market: string
	readonly url?: string
	readonly price?: number
	readonly unitMeasure?: string
	readonly active: boolean
	readonly offers: Offer[]
}
