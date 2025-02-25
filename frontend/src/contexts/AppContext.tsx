import { createContext, Dispatch, SetStateAction } from 'react'

export type AppType = {}

type AppContextProp<T> = {
	app: T
	setApp: Dispatch<SetStateAction<T>>
} | null

const AppContext = createContext<AppContextProp<AppType>>(null)

export default AppContext
