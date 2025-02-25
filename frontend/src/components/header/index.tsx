import { HTMLAttributes } from 'react'
import './index.css'

interface HeaderProps extends HTMLAttributes<HTMLElement> {
	children?: React.ReactNode
	hrefLogo?: string
}

const Header = ({ children, hrefLogo }: HeaderProps) => {
	return (
		<header id="header">
			<h1 className="logo">
				<a href={hrefLogo || '#'}>
					<span>Smart</span>Market
				</a>
			</h1>
			<div>
				{children}
				<div className="btn-wrapper">
					<button id="btn-login">Login</button>
					<button id="btn-signup">Sign Up</button>
				</div>
			</div>
		</header>
	)
}

export default Header
