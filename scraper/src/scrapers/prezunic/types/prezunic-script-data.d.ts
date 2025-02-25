interface PrezunicItem {
  '@type': string
  position: number
  item: {
    '@context': string
    '@type': string
    '@id': string //URL do produto
    name: string
    brand: {
      '@type': string
      name: string
    }
    image: string
    description: string
    mpn: string //MPN === Ean | É o ID do produto
    sku: string
    offers: {
      '@type': string
      lowPrice: number
      highPrice: number
      priceCurrency: string
      offers: {
        '@type': string
        price: number
        priceCurrency: string
        availability: string
        sku: string
        itemCondition: string
        priceValidUntil: string
        seller: {
          '@type': string
          name: string
        }
      }[]
      offerCount: number
    }
    gtin: string
  }
}

interface ItemListElement {
  '@type': string
  position: number
  item: PrezunicItem
}

export interface PrezunicScriptData {
  '@context': string
  '@type': string
  itemListElement: PrezunicItem[]
}