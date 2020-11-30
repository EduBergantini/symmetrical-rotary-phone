import bcrypt from 'bcrypt'
import { IEncrypter } from '../../data/protocols/encrypter'

export class BcryptAdapter implements IEncrypter {
  constructor (private readonly salt: number = 12) {
  }

  async encrypt (value: string): Promise<string> {
    await bcrypt.hash(value, this.salt)
    return null
  }
}
