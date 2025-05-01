import { FormEvent, HTMLAttributes, useEffect, useRef, useState } from 'react'
import Form from '../form'
import useAuthContext from '../../hooks/useAuthContext'
import Input from '../input'
import axios, { ENDPOINTS } from '../../api/axios'

import './index.css'
import Section from '../section'
import Button from '../button'

interface LoginProps extends HTMLAttributes<HTMLElement> {
	toRegister: () => void
	onClose: () => void
}

const Login = ({ toRegister, onClose: close }: LoginProps) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const userRef = useRef<HTMLInputElement>(null)
	const { setAuth } = useAuthContext()
	useEffect(() => {
		userRef.current!.focus()
	}, [])

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		try {
			const response = await axios.post<{ access_token: string }>(
				`${ENDPOINTS.AUTH}/login`,
				{ username, password },
				{ withCredentials: true }
			)
			if (response.data) {
				setAuth(prev => {
					console.log(response.data)
					return { ...prev, accessToken: response.data.access_token }
				})
				close()
			}
		} catch (error) {
			console.error(`Erro no login: ${error}`)
		}
	}

	return (
		<Section className="login-form">
			<h1>Login</h1>
			<Form onSubmit={handleSubmit}>
				<label htmlFor="username">Username:</label>
				<Input
					type="text"
					id="username"
					ref={userRef}
					autoComplete="off"
					onChange={e => setUsername(e.target.value)}
					value={username}
					required
				/>
				<label htmlFor="password">Password:</label>
				<Input
					type="password"
					id="password"
					autoComplete="off"
					onChange={e => setPassword(e.target.value)}
					value={password}
					required
				/>
				<Button $primary type="submit" disabled={!username || !password}>
					Login
				</Button>
			</Form>
			<span>
				Don't have an account? <button onClick={() => toRegister()}>Register</button>.
			</span>
		</Section>
	)
}

export default Login
