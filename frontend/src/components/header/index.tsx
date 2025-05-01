import { forwardRef, HTMLAttributes } from 'react'
import Button from '../button'
import { Link } from 'react-router-dom'

const Logo = ({ href, children }: { href: string; children: React.ReactNode }) => {
	return (
		<h1 className="text-dark-green h-fit w-fit text-[25px] font-bold uppercase text-shadow-[1px_1px_1px_rgb(0_0_0_/_0.5)]">
			{href !== '#' ? <Link to={href}>{children}</Link> : <a href={href}>{children}</a>}
		</h1>
	)
}

interface HeaderProps extends HTMLAttributes<HTMLElement> {
	children?: React.ReactNode
	hrefLogo?: string
}

const Header = forwardRef<HTMLElement, HeaderProps>(({ children, hrefLogo }: HeaderProps, ref) => {
	return (
		<header
			className="text-dark-green sticky top-0 z-1 flex max-h-[10vh] items-center justify-between bg-white px-[114px] py-[20px] shadow-md"
			ref={ref}
			id="header">
			<Logo href={hrefLogo || '#'}>
				<span className="text-green">Smart</span>Market
			</Logo>
			<div className="flex justify-end gap-[10px]">
				{children}
				<div className="flex max-w-min gap-[inherit] text-nowrap">
					<Button id="btn-login" $primary>
						Login
					</Button>
					<Button id="btn-signup">Sign Up</Button>
				</div>
			</div>
		</header>
	)
})

Header.displayName = 'Header'

export default Header
