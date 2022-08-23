import { TokenGenerator } from '@/domain/contracts/crypto'
import jwt from 'jsonwebtoken'

type Params = TokenGenerator.Params
type Result = TokenGenerator.Result

export class JwtTokenHandler implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken ({ expirationInMs, key }: Params): Promise<Result> {
    const expirationInSeconds = expirationInMs / 1000
    const token = await jwt.sign({ key }, this.secret, { expiresIn: expirationInSeconds })
    return token
  }
}
