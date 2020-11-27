export class ServerError extends Error {
  constructor () {
    super('Erro inesperado.')
    this.name = 'ServerError'
  }
}
