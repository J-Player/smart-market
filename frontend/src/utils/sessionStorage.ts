export const getItem = (key: string) => {
	try {
		const item = sessionStorage.getItem(key)
		return item ? JSON.parse(item) : undefined
	} catch (error) {
		console.error(error)
	}
}

export const setItem = (key: string, value: unknown) => {
	try {
		sessionStorage.setItem(key, JSON.stringify(value))
	} catch (error) {
		console.error(error)
	}
}

export default { getItem, setItem }
