import { Offer } from './offer'

export interface MarketProduct {
	id: string
	brand?: string
	name: string
	market: string
	url?: string
	price?: number
	unitMeasure?: string
	active: boolean
	offers: Offer[]
}
