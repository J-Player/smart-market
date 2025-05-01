import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	$primary?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, children, $primary, ...props }: ButtonProps, ref) => {
		return (
			<button
				ref={ref}
				className={cn(
					'bg-light-green border-dark-green rounded border px-[10px] py-[5px] outline-none disabled:cursor-not-allowed disabled:opacity-50 [&:hover]:bg-[linear-gradient(rgba(0,0,0,0.05)_0_0)] [&:not(:disabled)]:cursor-pointer',
					$primary && 'bg-green text-dark-green',
					className
				)}
				{...props}>
				{children}
			</button>
		)
	}
)

Button.displayName = 'Button'

export default Button
