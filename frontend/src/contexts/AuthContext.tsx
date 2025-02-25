import { Dispatch, SetStateAction, createContext } from 'react'

export type AuthType = {
	accessToken: string
} | null

type AuthContextProp<T> = {
	auth: T
	setAuth: Dispatch<SetStateAction<T>>
} | null

const AuthContext = createContext<AuthContextProp<AuthType>>(null)

export default AuthContext
