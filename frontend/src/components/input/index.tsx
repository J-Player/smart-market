import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, children, ...props }: InputProps, ref) => {
	return (
		<input
			ref={ref}
			{...props}
			className={cn(
				'border-dark-green min-w-fit rounded-[3px] border bg-white px-[10px] py-[5px] outline-none disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}>
			{children}
		</input>
	)
})

Input.displayName = 'Input'

export default Input
