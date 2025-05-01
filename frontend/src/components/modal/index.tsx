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
			<div id="modal" className="fixed inset-0 z-[1000] grid place-items-center bg-black/[0.5]">
				<div className="fixed top-1/2 z-[inherit] flex h-fit max-h-[90vh] -translate-y-1/2 flex-col justify-center gap-4 overflow-hidden rounded-[3px] bg-white p-[20px]">
					<Button
						className="text-dark-green hover:text-red focus:text-red aspect-square cursor-pointer self-end border-none bg-transparent p-0 hover:bg-transparent"
						onClick={handlerClose}>
						✖
					</Button>
					{children}
				</div>
			</div>
		)
	}
}

export default Modal
