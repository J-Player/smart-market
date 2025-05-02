import { cn } from '../../utils/cn'

export interface TableColumn<T> {
	key: keyof T
	label: string
	render?: <K extends keyof T>(value: T[K], item: T) => React.ReactNode
	sortable?: boolean
}

interface GenericTableProps<T> {
	data: T[]
	columns: TableColumn<T>[]
	sortBy?: keyof T
	sortDir?: 'asc' | 'desc'
	onSort?: (field: keyof T) => void
	className?: {
		table?: string
		head?: string
		body?: string
	}
	rowClassName?: string
	filter?: (item: T) => boolean
	actions?: (item: T) => React.ReactNode
}

const GenericTable = <T extends object>({
	data,
	columns,
	sortBy,
	sortDir,
	onSort,
	className,
	filter,
	actions
}: GenericTableProps<T>) => {
	const getSortClass = (column: keyof T) => {
		if (!sortBy || sortBy !== column) return ''
		const directionClass = sortDir === 'asc' ? 'after:content-["⬇"]' : 'after:content-["⬆"]'
		return `text-green after:ml-1 ${directionClass}`
	}

	return (
		<table className={cn(className?.table)}>
			<thead className={cn(className?.head)}>
				<tr>
					{columns.map((column, index) => (
						<th
							key={index}
							className={cn(column.sortable && 'cursor-pointer', getSortClass(column.key))}
							onClick={() => column.sortable && onSort?.(column.key)}>
							{column.label}
						</th>
					))}
					{actions && <th></th>}
				</tr>
			</thead>
			<tbody className={cn(className?.body)}>
				{data.map(
					(item, rowIndex) =>
						(filter?.(item) ?? true) && (
							<tr key={rowIndex}>
								{columns.map((column, colIndex) => (
									<td key={colIndex}>
										{column.render ? column.render(item[column.key], item) : (item[column.key] as React.ReactNode)}
									</td>
								))}
								{actions && <td>{actions(item)}</td>}
							</tr>
						)
				)}
			</tbody>
		</table>
	)
}

export default GenericTable
