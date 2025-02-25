import { useEffect, useState } from 'react'
import AuthContext, { AuthType } from '../contexts/AuthContext'

type AuthProviderProp = {
	children: React.ReactNode
}

const AuthProvider = ({ children }: AuthProviderProp) => {
	const [auth, setAuth] = useState<AuthType>(null)
	const AUTH_LOCALSTORAGE_KEY = 'auth'

	useEffect(() => {
		const data = localStorage.getItem(AUTH_LOCALSTORAGE_KEY)
		if (data) {
			const object: AuthType = JSON.parse(data)
			if (object)
				setAuth(prev => {
					return { ...prev, ...object }
				})
		}
	}, [])

	useEffect(() => {
		localStorage.setItem(AUTH_LOCALSTORAGE_KEY, JSON.stringify(auth))
	}, [auth])

	return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>
}

export default AuthProvider
