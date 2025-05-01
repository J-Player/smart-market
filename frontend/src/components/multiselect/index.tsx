import { HTMLAttributes, LabelHTMLAttributes, useEffect, useRef, useState } from 'react'
import Input from '../input'
import { cn } from '../../utils/cn'
import { normalizeText } from '../../utils/string-helper'

const Option = ({ className, children }: LabelHTMLAttributes<HTMLLabelElement>) => {
	return (
		<label className={cn('[&:hover]:bg-light-green flex w-full items-center gap-[10px] p-[10px]', className)}>
			{children}
		</label>
	)
}

interface MultiSelectProps<T> extends HTMLAttributes<HTMLDivElement> {
	id?: string
	options: T[]
	getLabel: (item: T) => string
	getValue: (item: T) => string
	selectedValues: string[]
	onChangeValues: (values: string[]) => void
	placeholder?: string
}

function MultiSelect<T>({
	id,
	className,
	options,
	getLabel,
	getValue,
	selectedValues,
	onChangeValues,
	placeholder = 'Buscar...'
}: MultiSelectProps<T>) {
	const [search, setSearch] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	const filtered = options.filter(opt => {
		const [options, text] = [getLabel(opt), search].map(i => normalizeText(i).toLowerCase())
		return options.includes(text)
	})

	const isAllSelected = selectedValues.length === options.length

	const toggleSelectAll = () => {
		onChangeValues(isAllSelected ? [] : options.map(getValue))
	}

	const toggleOption = (value: string) => {
		onChangeValues(
			selectedValues.includes(value) ? selectedValues.filter(v => v !== value) : [...selectedValues, value]
		)
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
		<div ref={containerRef} className={cn('relative min-w-fit', className)}>
			<Input
				id={id}
				className="w-full"
				type="text"
				placeholder={placeholder}
				value={search}
				onFocus={() => setIsOpen(true)}
				onChange={e => setSearch(e.target.value)}
			/>
			{isOpen && (
				<div className="absolute top-[calc(100%_-_2px)] right-0 left-0 z-10 flex max-h-[150px] min-w-fit flex-col overflow-y-auto rounded-b-[3px] border border-t-transparent bg-white">
					{filtered.length > 0 && (
						<Option>
							<Input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} /> Selecionar Todos
						</Option>
					)}
					{filtered.map(item => {
						const label = getLabel(item)
						const value = getValue(item)
						return (
							<Option>
								<Input type="checkbox" checked={selectedValues.includes(value)} onChange={() => toggleOption(value)} />
								{label}
							</Option>
						)
					})}
					{filtered.length === 0 && <div>Nenhum item encontrado</div>}
				</div>
			)}
		</div>
	)
}

export default MultiSelect
