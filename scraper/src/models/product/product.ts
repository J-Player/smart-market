import { UnitMeasure } from "../../common/enums/unit-measure"
import { Offer } from "../offer/offer"

export interface Product {
  brand?: string
  name: string
  url?: string
  price?: number
  unitMeasure?: UnitMeasure
  active: boolean
  offers?: Offer[]
}