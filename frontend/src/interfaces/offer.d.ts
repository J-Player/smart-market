export interface Offer {
	id: string
	type?: string
	price: number
	startDate?: string
	endDate?: string
	rule?: {
		minQuantity?: number
		maxQuantity?: number
		chargedQuantity?: number
		unitMeasure?: string
	}
}
