import { useEffect, useState } from 'react'
import local from '../utils/localStorage'
import session from '../utils/sessionStorage'

export const usePersistedState = <T>(key: string, initialValue: T, type: 'localstorage' | 'sessionstorage') => {
	const [value, setValue] = useState<T>(() => {
		const item = type === 'localstorage' ? local.getItem(key) : session.getItem(key)
		return item ? (item as T) : initialValue
	})

	useEffect(() => {
		switch (type) {
			case 'localstorage':
				local.setItem(key, value)
				break
			case 'sessionstorage':
				session.setItem(key, value)
				break
		}
	}, [key, value])

	return [value, setValue] as const
}
