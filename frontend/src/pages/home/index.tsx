import { Link } from 'react-router-dom'
import Footer from '../../components/footer'
import Header from '../../components/header'
import Section from '../../components/section'
import './index.css'

const HomePage = () => {
	return (
		<>
			<Header>
				<nav className="menu">
					<ul>
						<li>
							<a href="#about">Sobre</a>
						</li>
						<li>
							<a href="#">Guia</a>
						</li>
						<li>
							<a href="#">F.A.Q</a>
						</li>
						<li>
							<a href="#">Contato</a>
						</li>
					</ul>
				</nav>
			</Header>
			<Section id="home">
				<div className="content">
					<h1>
						Economize <b>tempo</b> & <b>dinheiro</b> nas <b>compras</b> do dia-a-dia.
					</h1>
					<p>
						Compare preços de diversos supermercados em um só lugar. Descubra as melhores ofertas perto de você e
						economize nas suas compras do dia-a-dia.
					</p>
					<div>
						<p>Então, vamos às compras?</p>
						<Link to={'search'} id="btn-start">
							Começar Agora
						</Link>
					</div>
				</div>
				<div className="image-wrapper">
					<img src="images/woman-with-shopping-cart.png" alt="" />
				</div>
			</Section>
			<Section id="about">
				<div>
					<div>
						<h2>Sobre</h2>
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
					<div className="image-wrapper">
						<img src="images/emblem.png" alt="" />
					</div>
				</div>
			</Section>
			<Footer>
				<p>Todos os direitos reservados - Cheapmarket 2025</p>
			</Footer>
		</>
	)
}

export default HomePage
