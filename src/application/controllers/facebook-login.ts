import { Controller } from '@/application/controllers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { AccessToken } from '@/domain/entities'
import { FacebookAuthentication } from '@/domain/usecases/facebook-authentication'

type HttpRequest = { token: string }
type Model = Error | { accessToken: string }

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuth: FacebookAuthentication) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuth({ token })
    return accessToken instanceof AccessToken ? ok({ accessToken: accessToken.value }) : unauthorized()
  }

  override buildValidators ({ token }: any): Validator[] {
    return [
      ...ValidationBuilder.of({ value: token, fieldName: 'token' }).required().build()
    ]
  }
}
