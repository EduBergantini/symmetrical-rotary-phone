
export interface ILogErrorRepository {
  log: (errorStack: string) => Promise<void>
}
