import { MarketProduct } from '../interfaces/market-product'
import { Offer } from '../interfaces/offer'

interface ProductProps extends MarketProduct {
	quantity?: number
}

export class Product {
	constructor(private props: ProductProps) {}

	get id(): string {
		return this.props.id
	}

	get brand(): string | undefined {
		return this.props.brand
	}

	get name(): string {
		return this.props.name
	}

	get market(): string {
		return this.props.market
	}

	get unitMeasure(): string | undefined {
		return this.props.unitMeasure
	}

	get active(): boolean {
		return this.props.active
	}

	get offers(): Offer[] {
		return this.props.offers
	}

	get price(): number | undefined {
		return this.props.price
	}

	get quantity(): number | undefined {
		return this.props.quantity
	}

	set quantity(value: number) {
		this.props.quantity = value
	}

	get total_price(): number {
		if (this.quantity && this.props.price) return this.quantity * this.props.price
		return 0
	}
}
