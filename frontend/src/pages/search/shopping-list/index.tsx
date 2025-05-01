import Button from '../../../components/button'
import { usePersistedState } from '../../../hooks/usePersistedState'
import { Product } from '../../../models/product'
import { cn } from '../../../utils/cn'

interface ShoppingListProps {
	items: Product[]
	removeItem: (product: Product) => void
}

const ShoppingList = ({ items, removeItem }: ShoppingListProps) => {
	const [sortBy, setSortBy] = usePersistedState<keyof Product>('sort', 'price', 'localstorage')
	const [sortDir, setSortDir] = usePersistedState<'asc' | 'desc'>('sort-direction', 'asc', 'localstorage')

	function handleAction(action: 'print' | 'save' | 'clean'): void {
		switch (action) {
			case 'print':
				alert('Printing...')
				break
			case 'save':
				alert('Saving...')
				break
			case 'clean':
				items.map(product => removeItem(product))
				break
		}
	}

	const handleSort = (field: keyof Product) => {
		if (sortBy === field) {
			setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
		} else {
			setSortBy(field)
			setSortDir('asc')
		}
	}

	const sortedResult = [...items]
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

	type TableColumn = {
		key: keyof Product
		label: string
	}

	const COLUMNS: TableColumn[] = [
		{ key: 'name', label: 'Produto' },
		{ key: 'quantity', label: 'Quantidade' },
		{ key: 'price', label: 'Preço (un)' },
		{ key: 'total_price', label: 'Preço (total)' },
		{ key: 'market', label: 'Mercado' },
		{ key: 'offers', label: 'Ofertas' }
	]

	const getSortClass = (column: keyof Product) => {
		if (sortBy !== column) return ''
		const directionClass = sortDir === 'asc' ? 'after:content-["⬇"]' : 'after:content-["⬆"]'
		return `text-green after:ml-1 ${directionClass}`
	}

	return (
		<div className="text-dark-green m-auto flex min-h-0 min-w-[50vw] flex-1 flex-col gap-[10px]" id="shopping-list">
			<h1 className="text-center font-bold uppercase">Lista de Compras</h1>
			<div className="relative max-h-fit min-h-0 flex-1 overflow-y-auto">
				<table className="border-collapse">
					<thead className="sticky top-[-1px] z-10 bg-white">
						<tr>
							{COLUMNS.map((o, index) => {
								return (
									<th
										className={cn(getSortClass(o.key), 'cursor-pointer p-[10px]')}
										onClick={() => handleSort(o.key)}
										key={index}>
										{o.label}
									</th>
								)
							})}
							<th></th>
						</tr>
					</thead>
					<tbody>
						{sortedResult.map((p, key) => (
							<tr
								className="[&_td]:border-opacity-0 [&_td]:border-dark-green/25 w-full text-center [&_td]:border [&_td]:p-[10px]"
								key={key}>
								<td>{p.name}</td>
								<td>{p.quantity}</td>
								<td>{p.price}</td>
								<td>R$ {p.total_price.toFixed(2)}</td>
								<td>{p.market}</td>
								<td>{p.offers.length}</td>
								<td>
									<Button
										className='bg-light-pink [&:after]:bg-dark-pink relative aspect-square p-1 [&:after]:absolute [&:after]:inset-0 [&:after]:mix-blend-overlay [&:after]:content-[""]'
										onClick={() => removeItem(p)}>
										➖
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="gap-[inherit]">
				<div className="text-dark-green flex w-full justify-between border-b p-[5px]">
					<span className="font-bold">Quantidade total de itens:</span>
					<span>
						{items.reduce((prev, curr) => {
							if (curr.quantity) {
								return prev + curr.quantity
							}
							return prev + 0
						}, 0)}
					</span>
				</div>
				<div className="flex min-h-0 flex-1 flex-col gap-[inherit] border-none">
					<span className="font-bold">Valor Total (por mercado):</span>
					<ul className="max-h-[20vh] min-h-0 flex-1 overflow-y-auto">
						{[...new Set(items.map(item => item.market))].map((market, index) => (
							<li className="ml-[20px] flex justify-between border-b border-dashed py-[5px] capitalize" key={index}>
								<span className="market">{market}</span>
								<span className="quantity">
									R${' '}
									{items
										.filter(i => i.market === market)
										.reduce((total, curr) => (curr.total_price ? total + curr.total_price : 0), 0)
										.toFixed(2)}
								</span>
							</li>
						))}
					</ul>
				</div>
				<div>
					<span className="font-bold">Valor Total:</span>
					<span className="font-bold">
						R$ {items.reduce((total, curr) => (curr.total_price ? total + curr.total_price : 0), 0).toFixed(2)}
					</span>
				</div>
			</div>
			<div className="flex justify-end gap-[10px]">
				<Button
					className="text-dark-pink bg-light-pink border-dark-pink"
					id="btn-clean"
					onClick={() => handleAction('clean')}
					disabled={items.length === 0}>
					Limpar
				</Button>
				<Button id="btn-print" onClick={() => handleAction('print')}>
					Imprimir
				</Button>
				<Button id="btn-save" onClick={() => handleAction('save')}>
					Salvar
				</Button>
			</div>
		</div>
	)
}

export default ShoppingList
