import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/home'
import SearchPage from '../pages/search'

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />
	},
	{
		path: '/search',
		element: <SearchPage />
	}
])

export default router
