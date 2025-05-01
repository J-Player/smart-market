import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, children, ...props }: InputProps, ref) => {
	return (
		<input
			ref={ref}
			{...props}
			className={cn(
				'border-light-gray [&:not(:disabled)]:hover:border-orange [&:not(:disabled)]:focus:border-orange border-2 px-2 py-1 outline-none disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}>
			{children}
		</input>
	)
})

Input.displayName = 'Input'

export default Input
