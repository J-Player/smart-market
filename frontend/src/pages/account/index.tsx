import { HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/button'
import Header from '../../components/header'
import Input from '../../components/input'
import MultiSelect from '../../components/multiselect'
import Section from '../../components/section'
import { cn } from '../../utils/cn'

const Tag = ({ children, className }: HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span
			className={cn(
				'bg-light-green border-dark-green flex items-center gap-[5px] rounded-[3px] border p-[5px]',
				className
			)}>
			{children}
		</span>
	)
}

const AccountPage = () => {
	const menu = [
		{ href: '/search', value: 'Pesquisar' },
		{ href: '/account', value: 'Conta' }
	] as const

	return (
		<>
			<Header hrefLogo="/">
				<nav className="flex min-w-full">
					<ul className="flex h-full w-full items-center justify-around">
						{menu.map((i, key) => (
							<li key={key}>
								<Link className="[&:hover,&:focus]:text-green outline-none" to={i.href}>
									{i.value}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</Header>
			<Section className="text-dark-green grid place-items-center p-[10vh]" id="account">
				<div className="border-dark-green flex w-full flex-col gap-[10px] self-stretch border bg-white p-[5vh]">
					<div className="flex w-full flex-col gap-[inherit]">
						<h1 className="text-lg font-bold uppercase">Dados da Conta</h1>
						<hr />
						<div className="flex w-fit flex-col justify-center gap-[inherit]">
							<div className="flex w-full items-center justify-between gap-[inherit]">
								<label className="cursor-pointer font-bold" htmlFor="username">
									Usuário:
								</label>
								<Input id="username" />
							</div>
							<div className="flex w-full items-center justify-between gap-[inherit]">
								<label className="cursor-pointer font-bold" htmlFor="password">
									Senha:
								</label>
								<Input id="password" type="password" />
							</div>
							<div className="flex gap-[inherit] self-end">
								<Button>Editar</Button>
								<Button className="bg-light-pink border-dark-pink text-dark-pink">Excluir Conta</Button>
							</div>
						</div>
					</div>
					<div className="flex w-full flex-col gap-[inherit]">
						<h1 className="text-lg font-bold uppercase">Preferências</h1>
						<hr />
						<div className="flex w-full max-w-[50%] flex-col items-start gap-[inherit]">
							<div className="flex w-full items-center gap-[inherit]">
								<label className="cursor-pointer font-bold" htmlFor="markets">
									Mercados:
								</label>
								<MultiSelect
									id="markets"
									options={[]}
									getLabel={() => ''}
									getValue={() => ''}
									onChangeValues={() => ''}
									selectedValues={[]}
									placeholder="Escolha um ou mais mercados"
									className="w-full min-w-0" // Adicione esta linha
								/>
							</div>
							<div className="flex w-full flex-col gap-[inherit]">
								{['Guanabara', 'Mundial', 'Unidos', 'Prezunic'].map((m, key) => (
									<Tag key={key} className="flex w-full items-center justify-between gap-[10vw] p-2">
										<span className="flex items-center gap-[10px] font-bold">
											<Button
												className="hover:text-pink flex aspect-square items-center justify-center rounded-none border-none bg-transparent p-0"
												onClick={() => {}}>
												<small>✖</small>
											</Button>
											{m}
										</span>
										<div className="flex items-center gap-[10px]">
											<span>0 de 2 ofertas</span>
											<Button className="grid place-items-center border-none p-0">
												<img src="icons/expand-arrow.png" alt="" className="h-4 w-4" />
											</Button>
										</div>
									</Tag>
								))}
							</div>
						</div>
					</div>
				</div>
			</Section>
		</>
	)
}

export default AccountPage
