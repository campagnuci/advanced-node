import { Authorize } from '@/domain/usecases'
import { forbidden, HttpResponse, ok } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validation'

type HttpRequest = { authorization: string }
type Model = Error | { userId: string }

export class AuthenticationMiddleware {
  constructor (private readonly authorize: Authorize) {}
  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      if (!this.validate({ authorization })) return forbidden()
      const userId = await this.authorize({ token: authorization })
      return ok({ userId })
    } catch (error) {
      return forbidden()
    }
  }

  private validate ({ authorization }: HttpRequest): boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()
    return error === undefined
  }
}
