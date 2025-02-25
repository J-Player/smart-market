import { useEffect, useRef, useState } from 'react'
import './index.css'

function normalizeText(text: string) {
	return text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
}

type MultiSelectProps<T> = {
	id?: string
	options: T[]
	getLabel: (item: T) => string
	getValue: (item: T) => string
	selectedValues: string[]
	onChange: (values: string[]) => void
	placeholder?: string
}

function MultiSelect<T>({
	id,
	options,
	getLabel,
	getValue,
	selectedValues,
	onChange,
	placeholder = 'Buscar...'
}: MultiSelectProps<T>) {
	const [search, setSearch] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	console.log(options)

	const filtered = options.filter(opt => normalizeText(getLabel(opt)).includes(normalizeText(search)))

	const isAllSelected = selectedValues.length === options.length

	const toggleSelectAll = () => {
		onChange(isAllSelected ? [] : options.map(getValue))
	}

	const toggleOption = (value: string) => {
		onChange(selectedValues.includes(value) ? selectedValues.filter(v => v !== value) : [...selectedValues, value])
	}

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	return (
		<div id={id} ref={containerRef} className="select" onClick={() => setIsOpen(true)}>
			<input
				type="text"
				placeholder={placeholder}
				value={search}
				onFocus={() => setIsOpen(true)}
				onChange={e => setSearch(e.target.value)}
			/>
			{isOpen && (
				<div className="dropdown-list">
					{filtered.length > 0 && (
						<label>
							<input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} /> Selecionar Todos
						</label>
					)}
					{filtered.map(item => {
						const label = getLabel(item)
						const value = getValue(item)
						return (
							<label key={value}>
								<input type="checkbox" checked={selectedValues.includes(value)} onChange={() => toggleOption(value)} />
								{label}
							</label>
						)
					})}
					{filtered.length === 0 && <div>Nenhum item encontrado</div>}
				</div>
			)}
		</div>
	)
}

export default MultiSelect
