import { FormEvent, HTMLAttributes, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'
import Button from '../../components/button'
import Header from '../../components/header'
import Input from '../../components/input'
import Modal from '../../components/modal'
import MultiSelect from '../../components/multiselect'
import Section from '../../components/section'
import GenericTable, { TableColumn } from '../../components/table'
import { usePersistedState } from '../../hooks/usePersistedState'
import { Market } from '../../interfaces/market'
import { Product } from '../../interfaces/product'
import { ProductMapper } from '../../mappers/product-mapper'
import { Product as ProductModel } from '../../models/product'
import MarketProductService from '../../services/market-product-service'
import MarketService from '../../services/market-service'
import ProductService from '../../services/product-service'
import { cn } from '../../utils/cn'
import ShoppingList from './shopping-list'

const Tag = ({ children, className }: HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span
			className={cn('bg-green border-dark-green flex items-center gap-[5px] rounded-[3px] border p-[5px]', className)}>
			{children}
		</span>
	)
}

const SearchPage = () => {
	const [products, setProducts] = usePersistedState<Product[]>('product-list', [], 'sessionstorage')
	const [markets, setMarkets] = usePersistedState<Market[]>('market-list', [], 'sessionstorage')
	const [quantity, setQuantity] = useState<number | undefined>()
	const [displayValue, setDisplayValue] = useState('')
	const [shoppingList, setShoppingList] = usePersistedState<ProductModel[]>('shopping-list', [], 'localstorage')
	const [showShoppingList, setShowShoppingList] = useState<boolean>(false)
	const [hideItemAdded, setHideItemAdded] = useState<boolean>(false)
	const [result, setResult] = useState<ProductModel[]>([])

	const [product, setProduct] = useState<string>('')
	const [marketsSelected, setMarketsSeleted] = useState<string[]>([])

	const MAX_VISIBLE_TAGS = 5
	const visibleTags = marketsSelected.slice(0, MAX_VISIBLE_TAGS)
	const hiddenCount = marketsSelected.length - MAX_VISIBLE_TAGS

	const [sortBy, setSortBy] = usePersistedState<keyof ProductModel>('sort', 'price', 'localstorage')
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val: string = e.target.value
			// Remove todos os caracteres não numéricos
			.replace(/[^0-9]/g, '')
			// Remove zeros à esquerda (exceto se for o único caractere)
			.replace(/^0+(?=\d)/, '')

		// Atualiza os estados
		setDisplayValue(val)
		setQuantity(val.length === 0 ? 0 : Number(val))
	}

	const handleSort = (field: keyof ProductModel) => {
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
		marketProductService.findAll(product, marketsSelected).then(res => setResult(res.data.map(ProductMapper.toDomain)))
	}

	const addItemToList = (p: ProductModel) => {
		setShoppingList(prev => {
			// Verifica se o item já existe na lista
			const itemExists = prev.some(item => item.id === p.id)
			// Se não existir, retorna um NOVO array com o item adicionado
			if (!itemExists) {
				if (quantity) p.quantity = quantity
				return [...prev, p]
			}
			// Se já existir, retorna o array sem modificações
			return prev
		})
	}

	const subItemToList = (p: ProductModel) => {
		setShoppingList(prev => {
			return prev.filter(i => i.id !== p.id)
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
	})

	useEffect(() => {
		setResult(prev => {
			return prev.map(p => {
				if (!shoppingList.find(i => p.id === i.id)) p.quantity = quantity || 1
				return p
			})
		})
	}, [quantity, shoppingList])

	const tableColumns: TableColumn<ProductModel>[] = [
		{
			key: 'name',
			label: 'Produto',
			sortable: true
		},
		{
			key: 'quantity',
			label: 'Quantidade',
			sortable: true
		},
		{
			key: 'price',
			label: 'Preço (un)',
			sortable: true,
			render: (_, product) => `R$ ${product.price!.toFixed(2)}`
		},
		{
			key: 'total_price',
			label: 'Preço (total)',
			sortable: true,
			render: (_, product) => `R$ ${product.total_price.toFixed(2)}`
		},
		{
			key: 'market',
			label: 'Mercado',
			sortable: true
		},
		{
			key: 'offers',
			label: 'Ofertas',
			sortable: true,
			render: (_, value) => value.offers.length
		}
	]

	const menu = [
		{ href: '/search', value: 'Pesquisar' },
		{ href: '/account', value: 'Conta' }
	] as const

	return (
		<>
			<Header hrefLogo="/">
				<nav className="flex min-w-full">
					<ul className="flex h-full w-full items-center justify-around">
						{menu.map((i, key) => (
							<li key={key}>
								<Link className="[&:hover,&:focus]:text-green outline-none" to={i.href}>
									{i.value}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</Header>
			<Section id="search">
				<div className="grid min-h-[100vh] place-items-center bg-white p-[10vh]">
					<div className="relative min-w-[50%] flex flex-col gap-[10px]">
						<form className="flex flex-col gap-[inherit]" method="post" onReset={handleReset} onSubmit={handleSubmit}>
							<div className="flex items-center gap-[inherit]">
								<label htmlFor="product">Produto:</label>
								<Input
									className="w-full"
									id="product"
									type="text"
									value={product}
									onChange={e => setProduct(e.currentTarget.value)}
									placeholder="Digite o nome, tipo ou marca de um produto"
								/>
							</div>
							<div className="flex items-center gap-[inherit]">
								<label htmlFor="markets">Mercados:</label>
								<MultiSelect<Market>
									id="markets"
									className="w-full"
									options={markets}
									getLabel={item => item.name}
									getValue={item => item.id}
									selectedValues={marketsSelected}
									onChangeValues={setMarketsSeleted}
									placeholder="Escolha um ou mais mercados"
								/>
							</div>
							<div className="flex w-fit flex-wrap gap-[inherit]">
								{visibleTags.map(id => {
									const item = markets.find(market => market.id === id)
									if (!item) return null
									return (
										<Tag key={id}>
											<span>{item.name}</span>
											<Button
												className="[&:hover]:text-pink flex aspect-square max-h-fit items-center rounded-none border-none bg-transparent p-0"
												onClick={() => setMarketsSeleted(prev => prev.filter(val => val !== id))}>
												<small>✖</small>
											</Button>
										</Tag>
									)
								})}
								{hiddenCount > 0 && (
									<Tag
										title={marketsSelected
											.slice(MAX_VISIBLE_TAGS)
											.map(id => {
												const market = markets.find(m => m.id === id)
												return market ? market.name : ''
											})
											.join('\n')}>
										+{hiddenCount} mercados
									</Tag>
								)}
								{visibleTags.length > 0 && (
									<Button
										className="[&:hover]:text-pink border-none bg-transparent"
										onClick={() => setMarketsSeleted([])}>
										✖
									</Button>
								)}
							</div>
							<div className="mx-auto flex gap-[inherit]">
								<Button type="reset">Limpar</Button>
								<Button type="submit" $primary>
									Pesquisar
								</Button>
							</div>
						</form>
						{result.length > 0 && (
							<div className="flex w-full flex-col items-center gap-[inherit]">
								<div className="flex items-center gap-[inherit]">
									<label htmlFor="hide-listed-item">Ocultar itens que já estão na lista de compras:</label>
									<Input
										className="cursor-pointer"
										type="checkbox"
										id="hide-listed-item"
										onChange={e => setHideItemAdded(e.target.checked)}
									/>
									<label htmlFor="quantity">Quantidade:</label>
									<Input
										type="text"
										inputMode="numeric"
										pattern="[0-9]*"
										name="quantity"
										id="quantity"
										value={displayValue}
										onChange={handleChange}
										placeholder="Quantidade do produto"
										required
									/>
								</div>
								<GenericTable<ProductModel>
									data={sortedResult}
									className={{
										table: 'relative w-full text-center text-nowrap',
										head: 'bg-dark-green text-light-green sticky top-[calc(10vh_-_1px)] z-2 [&_th]:p-[10px]',
										body: '[&_td]:border-dark-green/25 [&_td]:border [&_td]:p-[10px] [&_tr]:hover:bg-[linear-gradient(rgba(0,255,0,0.05)_0_0)]'
									}}
									columns={tableColumns}
									sortBy={sortBy}
									sortDir={sortDir}
									onSort={handleSort}
									filter={p => !(shoppingList.find(i => i.id === p.id) && hideItemAdded)}
									actions={p =>
										!shoppingList.find(i => i.id === p.id) ? (
											<Button
												className="bg-light-green border-dark-green [&:after]:bg-dark-green relative p-[5px] after:absolute after:inset-0 after:mix-blend-overlay after:content-['']"
												onClick={() => addItemToList(p)}
												disabled={!quantity}>
												➕
											</Button>
										) : (
											<Button
												className="bg-light-pink border-dark-pink [&:after]:bg-dark-pink relative p-[5px] after:absolute after:inset-0 after:mix-blend-overlay after:content-['']"
												onClick={() => subItemToList(p)}>
												➖
											</Button>
										)
									}
								/>
							</div>
						)}
						<Button
							className="fixed right-[10%] bottom-[10vw] z-20 rounded-[50%] p-[10px]"
							onClick={() => setShowShoppingList(true)}>
							<img src="icons/list.png" alt="list" />
						</Button>
					</div>
				</div>
				<Modal show={showShoppingList} onClose={() => setShowShoppingList(false)}>
					<ShoppingList items={shoppingList} removeItem={subItemToList} />
				</Modal>
			</Section>
		</>
	)
}

export default SearchPage
