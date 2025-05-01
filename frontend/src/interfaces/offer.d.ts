export interface Offer {
	readonly id: string
	readonly type?: string
	readonly price: number
	readonly startDate?: string
	readonly endDate?: string
	readonly rule?: {
		readonly minQuantity?: number
		readonly maxQuantity?: number
		readonly chargedQuantity?: number
		readonly unitMeasure?: string
	}
}
