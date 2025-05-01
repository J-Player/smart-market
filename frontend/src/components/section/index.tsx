import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface SectionProps extends HTMLAttributes<HTMLElement> {
	children: React.ReactNode
}

const Section = forwardRef<HTMLElement, SectionProps>(({ className, children, ...props }: SectionProps, ref) => {
	return (
		<section ref={ref} className={cn('min-h-[100vh] max-w-[100vw]', className)} {...props}>
			{children}
		</section>
	)
})

export default Section
