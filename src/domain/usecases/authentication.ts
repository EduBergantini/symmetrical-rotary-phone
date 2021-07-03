export interface AuthenticationModel {
  email: string
  password: string
}

export interface IAuthentication {
  auth: (model: AuthenticationModel) => Promise<string>
}
