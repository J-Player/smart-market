import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import router from './routes/router'
import { RouterProvider } from 'react-router'
import AppProvider from './providers/AppProvider'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppProvider>
			<RouterProvider router={router} />
		</AppProvider>
	</StrictMode>
)
