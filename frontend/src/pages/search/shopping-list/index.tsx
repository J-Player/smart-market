import Button from '../../../components/button'
import GenericTable, { TableColumn } from '../../../components/table'
import { usePersistedState } from '../../../hooks/usePersistedState'
import { Product } from '../../../models/product'

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

	const tableColumns: TableColumn<Product>[] = [
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

	return (
		<div className="text-dark-green m-auto flex min-h-0 min-w-[50vw] flex-1 flex-col gap-[10px]" id="shopping-list">
			<h1 className="text-center font-bold uppercase">Lista de Compras</h1>
			<div className="grid h-full grid-rows-[1fr_auto] gap-[inherit]">
				<div className="max-h-[150px] min-h-0 overflow-y-auto">
					<GenericTable<Product>
						data={sortedResult}
						columns={tableColumns}
						sortBy={sortBy}
						sortDir={sortDir}
						onSort={handleSort}
						className={{
							table: 'text-center [&_td,&_th]:p-[10px]',
							head: 'border-dark-green sticky top-[-1px] z-2 border-b bg-white',
							body: '[&_td]:border-dark-green/25 [&_td]:border [&_td]:p-[10px] [&_tr]:hover:bg-[linear-gradient(rgba(0,255,0,0.05)_0_0)]'
						}}
						actions={product => (
							<Button
								className='bg-light-pink [&:after]:bg-dark-pink relative aspect-square p-1 [&:after]:absolute [&:after]:inset-0 [&:after]:mix-blend-overlay [&:after]:content-[""]'
								onClick={() => removeItem(product)}>
								➖
							</Button>
						)}
					/>
				</div>
				<div className="flex min-h-0 flex-col gap-[10px]">
					<div className="text-dark-green border-dark-green flex w-full justify-between border-b">
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
					<div className="flex flex-1 flex-col gap-[10px]">
						<span className="font-bold">Valor Total (por mercado):</span>
						<ul className="max-h-[150px] min-h-0 overflow-y-auto">
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
					<div className="text-dark-green border-dark-green flex w-full justify-between border-b">
						<span className="font-bold">Valor Total:</span>
						<span className="font-bold">
							R$ {items.reduce((total, curr) => (curr.total_price ? total + curr.total_price : 0), 0).toFixed(2)}
						</span>
					</div>
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
