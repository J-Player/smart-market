import { UnitMeasure } from "../../common/enums/unit-measure"

export interface OfferRule {
  minQuantity?: number
  maxQuantity?: number
  chargedQuantity?: number
  unitMeasure: UnitMeasure
}