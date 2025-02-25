import { OfferRule } from "./offer-rule"

export interface Offer {
  type?: string
  price?: number
  startDate?: Date
  endDate?: Date
  rule?: OfferRule
}