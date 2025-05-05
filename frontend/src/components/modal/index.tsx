import { useEffect } from 'react'
import usePortal from '../../hooks/usePortal'
import Button from '../button'

type ModalProps = {
	show: boolean
	scrollToTop?: boolean
	onClose: () => void
	children: React.ReactNode
}

const Modal = ({ children, show, scrollToTop, onClose: close }: ModalProps) => {
	const handlerClose = () => {
		if (document.body.style.overflow === 'hidden') document.body.style.overflow = 'visible'
		close()
	}
	useEffect(() => {
		const keyListener = (e: KeyboardEvent) => {
			if (e.key === 'Escape') handlerClose()
		}
		const clickListener = (e: MouseEvent) => {
			if (!(e.target instanceof HTMLDivElement)) return
			if (e.target.id === 'modal') handlerClose()
		}
		addEventListener('keyup', keyListener)
		addEventListener('click', clickListener)
		return () => {
			removeEventListener('keyup', keyListener)
			removeEventListener('click', clickListener)
		}
	}, [])

	useEffect(() => {
		document.body.style.overflow = show ? 'hidden' : 'visible'
	}, [show])

	if (show) {
		if (scrollToTop) window.scrollTo({ top: 0 })
		return usePortal(
			<div id="modal" className="fixed inset-0 z-[1000] grid place-items-center bg-black/50">
				<div className="relative z-[inherit] flex max-h-[90vh] max-w-[80vw] flex-col rounded-[3px] bg-white p-5">
					<Button
						className="text-dark-green hover:text-red aspect-square self-end border-none bg-transparent p-0"
						onClick={handlerClose}>
						✖
					</Button>
					<div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">{children}</div>
				</div>
			</div>
		)
	}
}

export default Modal
