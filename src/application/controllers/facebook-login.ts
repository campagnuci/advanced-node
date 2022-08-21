import { Controller } from '@/application/controllers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuth: FacebookAuthentication) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuth.perform({ token })
    return accessToken instanceof AccessToken ? ok({ accessToken: accessToken.value }) : unauthorized()
  }

  override buildValidators ({ token }: any): Validator[] {
    return [
      ...ValidationBuilder.of({ value: token, fieldName: 'token' }).required().build()
    ]
  }
}
