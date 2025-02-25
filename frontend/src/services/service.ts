import { Axios } from 'axios'

export default abstract class Service {
	constructor(protected readonly axios: Axios) {}
}
