
export interface ILogErrorRepository {
  logError: (errorStack: string) => Promise<void>
}
