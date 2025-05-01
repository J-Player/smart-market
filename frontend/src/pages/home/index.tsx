import { Link } from 'react-router-dom'
import Button from '../../components/button'
import Footer from '../../components/footer'
import Header from '../../components/header'
import Section from '../../components/section'

const HomePage = () => {
	const menu = [
		{ href: '#about', value: 'Sobre' },
		{ href: '#', value: 'Guia' },
		{ href: '#', value: 'F.A.Q' },
		{ href: '#', value: 'Contato' }
	] as const
	return (
		<>
			<Header>
				<nav className="flex min-w-full">
					<ul className="flex h-full w-full items-center justify-around">
						{menu.map((i, key) => (
							<li key={key}>
								<a className="[&:hover,&:focus]:text-green outline-none" href={i.href}>
									{i.value}
								</a>
							</li>
						))}
					</ul>
				</nav>
			</Header>
			<Section id="home">
				<div className="text-dark-green mx-[114px] my-[56px] flex items-center gap-[50px]">
					<div className="flex max-w-min flex-col gap-[10px] text-xl">
						<h1 className="text-4xl">
							Economize <b>tempo</b> & <b>dinheiro</b> nas <b>compras</b> do dia-a-dia.
						</h1>
						<p>
							Compare preços de diversos supermercados em um só lugar. Descubra as melhores ofertas perto de você e
							economize nas suas compras do dia-a-dia.
						</p>
						<div className="flex items-center gap-[10px] text-nowrap">
							<p>Então, vamos às compras?</p>
							<Link to="/search">
								<Button className="drop-shadow-[0_4px_4px_rgb(0_0_0_/_0.1)]" id="btn-start" $primary>
									Começar Agora
								</Button>
							</Link>
						</div>
					</div>
					<div>
						<img src="images/woman-with-shopping-cart.png" alt="" />
					</div>
				</div>
			</Section>
			<Section className="text-dark-green grid place-items-center px-[10vw] px-[114px] py-[56px]" id="about">
				<div className="border-dark-green grid h-full grid-cols-2 place-items-center border bg-white px-[76px]">
					<div>
						<h2 className="text-3xl font-bold uppercase">Sobre</h2>
						<p>
							Fazer compras em supermercados nem sempre é simples — <b>comparar preços</b>,{' '}
							<b>encontrar boas ofertas</b> e <b>montar uma lista de compras</b> eficiente pode levar tempo. Pensando
							nisso, criamos uma plataforma que reúne dados de diversos mercados, atualizados em tempo real, incluindo
							encartes, promoções e valores praticados em diferentes regiões.
						</p>
						<p>
							Nosso objetivo é facilitar sua rotina, ajudando você a economizar e tomar decisões de compra com mais
							confiança. Tudo isso de forma prática, rápida e em um só lugar.
						</p>
					</div>
					<div>
						<img src="images/emblem.png" alt="" />
					</div>
				</div>
			</Section>
			<Footer>
				<p>Todos os direitos reservados - SmartMarket 2025</p>
			</Footer>
		</>
	)
}

export default HomePage
