import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthProvider from './AuthProvider'
import AppContext from '../contexts/AppContext'

type AppProviderProp = {
	children: React.ReactNode
}

const query = new QueryClient()

const AppProvider = ({ children }: AppProviderProp) => {
	return (
		<QueryClientProvider client={query}>
			<AppContext.Provider value={null}>
				<AuthProvider>{children}</AuthProvider>
			</AppContext.Provider>
		</QueryClientProvider>
	)
}

export default AppProvider
