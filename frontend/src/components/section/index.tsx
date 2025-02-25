import { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface SectionProps extends HTMLAttributes<HTMLElement> {
	children: React.ReactNode
}

export default function Section({ className, children, ...props }: SectionProps) {
	return (
		<section className={cn('min-h-[100vh] max-w-[100vw]', className)} {...props}>
			{children}
		</section>
	)
}
