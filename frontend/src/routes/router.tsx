import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/home'
import SearchPage from '../pages/search'
import AccountPage from '../pages/account'

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />
	},
	{
		path: '/search',
		element: <SearchPage />
	},
	{
		path: '/account',
		element: <AccountPage />
	}
])

export default router
