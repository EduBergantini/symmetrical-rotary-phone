export class ServerError extends Error {
  constructor (errorStack: string) {
    super('Erro inesperado.')
    this.name = 'ServerError'
    this.stack = errorStack
  }
}
