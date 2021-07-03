import bcrypt from 'bcrypt'
import { IEncrypter } from '../../data/protocols/criptography/encrypter'

export class BcryptAdapter implements IEncrypter {
  constructor (private readonly salt: number) {
  }

  async encrypt (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}
