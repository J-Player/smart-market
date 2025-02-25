import { HTMLAttributes } from 'react'
import './index.css'

interface FooterProps extends HTMLAttributes<HTMLElement> {
	children: React.ReactNode
}

const Footer = ({ children }: FooterProps) => {
	return (
		<div id="footer">
			<small>{children}</small>
		</div>
	)
}

export default Footer
