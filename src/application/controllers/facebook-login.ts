import { Controller } from '@/application/controllers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { FacebookAuthentication } from '@/domain/usecases/facebook-authentication'

type HttpRequest = { token: string }
type Model = Error | { accessToken: string }

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuth: FacebookAuthentication) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.facebookAuth({ token })
      return ok(accessToken)
    } catch (error) {
      return unauthorized()
    }
  }

  override buildValidators ({ token }: any): Validator[] {
    return [
      ...ValidationBuilder.of({ value: token, fieldName: 'token' }).required().build()
    ]
  }
}
