import { FormEvent, useEffect, useState } from 'react'
import axios from '../../api/axios'
import Header from '../../components/header'
import MultiSelect from '../../components/multiselect'
import Section from '../../components/section'
import { usePersistedState } from '../../hooks/usePersistedState'
import { Market } from '../../interfaces/market'
import { MarketProduct } from '../../interfaces/market-product'
import { Product } from '../../interfaces/product'
import MarketProductService from '../../services/market-product-service'
import MarketService from '../../services/market-service'
import ProductService from '../../services/product-service'
import './index.css'

const SearchPage = () => {
	const [products, setProducts] = usePersistedState<Product[]>('product-list', [], 'sessionstorage')
	const [markets, setMarkets] = usePersistedState<Market[]>('market-list', [], 'sessionstorage')
	const [shoppingList, setShoppingList] = usePersistedState<MarketProduct[]>('shopping-list', [], 'localstorage')
	const [quantity, setQuantity] = useState<number | undefined>()
	const [result, setResult] = useState<MarketProduct[]>([])

	const [product, setProduct] = useState<string>('')
	const [marketsSelected, setMarketsSeleted] = useState<string[]>([])

	const MAX_VISIBLE_TAGS = 5
	const visibleTags = marketsSelected.slice(0, MAX_VISIBLE_TAGS)
	const hiddenCount = marketsSelected.length - MAX_VISIBLE_TAGS

	const [sortBy, setSortBy] = usePersistedState<keyof MarketProduct>('sort', 'price', 'localstorage')
	const [sortDir, setSortDir] = usePersistedState<'asc' | 'desc'>('sort-direction', 'asc', 'localstorage')

	const sortedResult = [...result]
		.filter(p => p.active)
		.sort((a, b) => {
			if (!sortBy) return 0
			let valA = a[sortBy]
			let valB = b[sortBy]

			if (sortBy === 'offers') {
				valA = a.offers?.length ?? 0
				valB = b.offers?.length ?? 0
			}

			if (valA === undefined && valB !== undefined) return sortDir === 'asc' ? 1 : -1
			if (valA !== undefined && valB === undefined) return sortDir === 'asc' ? -1 : 1
			if (valA === undefined && valB === undefined) return 0
			if (valA! < valB!) return sortDir === 'asc' ? -1 : 1
			if (valA! > valB!) return sortDir === 'asc' ? 1 : -1
			return 0
		})

	const getSortClass = (column: string) => {
		if (sortBy !== column) return ''
		return sortDir === 'asc' ? 'asc' : 'desc'
	}

	const handleSort = (field: keyof MarketProduct) => {
		if (sortBy === field) {
			setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
		} else {
			setSortBy(field)
			setSortDir('asc')
		}
	}

	const handleReset = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setProduct('')
		setMarketsSeleted([])
		e.currentTarget.reset()
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const marketProductService = new MarketProductService(axios)
		marketProductService.findAll(product, marketsSelected).then(res => setResult(res.data))
	}

	const addItemToList = (p: MarketProduct) => {
		setShoppingList(prev => {
			const index = prev.findIndex(i => i.id == p.id)
			if (index !== -1) prev.push(p)
			else console.log(`ERROR: id ${p.id} já existe na lista de compras...`)
			return prev
		})
	}

	const subItemToList = (p: MarketProduct) => {
		setShoppingList(prev => {
			const index = prev.findIndex(i => i.id == p.id)
			if (index === -1) prev.splice(index, 1)
			else console.log(`ERROR: id ${p.id} não encontrado na lista de compras...`)
			return prev
		})
	}

	useEffect(() => {
		const productService = new ProductService(axios)
		const marketService = new MarketService(axios)
		if (products.length == 0)
			productService.findAll().then(res => {
				if (Array.isArray(res.data)) setProducts(res.data)
			})
		if (markets.length == 0)
			marketService.findAll().then(res => {
				if (Array.isArray(res.data)) setMarkets(res.data)
			})
	}, [])

	return (
		<>
			<Header hrefLogo="/" />
			<Section id="search">
				<div className="search-container">
					<div className="content-wrapper">
						<div className="form-wrapper">
							<form method="post" onReset={handleReset} onSubmit={handleSubmit}>
								<div>
									<label htmlFor="product">Produto:</label>
									<input id="product" type="text" value={product} onChange={e => setProduct(e.currentTarget.value)} />
								</div>
								<div>
									<label htmlFor="select_market">Mercados:</label>
									<MultiSelect<Market>
										options={markets}
										getLabel={item => item.name}
										getValue={item => item.id}
										selectedValues={marketsSelected}
										onChange={setMarketsSeleted}
										placeholder=""
									/>
								</div>
								<div className="tag-wrapper">
									{visibleTags.map(id => {
										const item = markets.find(i => i.id === id)
										if (!item) return null
										return (
											<span className="tag" key={id}>
												<span>{item.name}</span>
												<button onClick={() => setMarketsSeleted(prev => prev.filter(val => val !== id))}>×</button>
											</span>
										)
									})}
									{hiddenCount > 0 && (
										<span
											className="tag"
											title={marketsSelected
												.slice(MAX_VISIBLE_TAGS)
												.map(id => {
													const item = markets.find(i => i.id === id)
													return item ? item.name : ''
												})
												.join('\n')}>
											+{hiddenCount} mercados
										</span>
									)}
									{visibleTags.length > 0 && <button onClick={() => setMarketsSeleted([])}>✖</button>}
								</div>
								<div>
									<button type="reset">Limpar</button>
									<button type="submit">Pesquisar</button>
								</div>
							</form>
						</div>
						{result.length > 0 && (
							<div className="result-wrapper">
								<div>
									<span>
										Ocultar itens que já estão na lista de compras:{' '}
										<input type="checkbox" name="hide-listed-item" id="hide-listed-item" />
									</span>
									<label htmlFor="quantity">Quantidade:</label>
									<input
										type="number"
										inputMode="numeric"
										pattern="[0-9]*"
										name="quantity"
										id="quantity"
										value={quantity}
										onChange={e => {
											const val = e.target.value.replace(/[^0-9]/g, '').replace(/^0+/, '')
											setQuantity(Number(val || 0))
										}}
									/>
									<button disabled={!quantity}>Otimizar</button>
								</div>
								<table>
									<thead>
										<tr>
											<th className={getSortClass('name')} onClick={() => handleSort('name')}>
												Produto
											</th>
											<th className={getSortClass('price')} onClick={() => handleSort('price')}>
												Preço (un)
											</th>
											<th className={getSortClass('market')} onClick={() => handleSort('market')}>
												Mercado
											</th>
											<th className={getSortClass('offers')} onClick={() => handleSort('offers')}>
												Ofertas
											</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{sortedResult
											.filter(p => p.active)
											.map(p => {
												return (
													<tr>
														<td>{p.name}</td>
														<td>{p.price}</td>
														<td>{p.price && quantity ? p.price * quantity : ''}</td>
														<td>{p.market}</td>
														<td>{p.offers.length}</td>
														<td>
															<button className="add" onClick={() => addItemToList(p)}>
																➕
															</button>
															<button className="sub" onClick={() => subItemToList(p)}>
																➖
															</button>
														</td>
													</tr>
												)
											})}
									</tbody>
								</table>
							</div>
						)}
						<button className="btn-list">
							<img src="icons/list.png" alt="list" />
						</button>
					</div>
				</div>
				<button>
					<img src="images/list.svg" alt="list" />
				</button>
			</Section>
		</>
	)
}

export default SearchPage
