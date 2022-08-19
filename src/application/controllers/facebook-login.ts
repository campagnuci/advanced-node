import { ValidationBuilder, ValidationComposite } from '@/application/validation'
import { badRequest, HttpResponse, ok, serverError, unauthorized } from '@/application/helpers'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor (private readonly facebookAuth: FacebookAuthentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest)
      if (error !== undefined) {
        return badRequest(error)
      }
      const accessToken = await this.facebookAuth.perform({ token: httpRequest.token })
      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value })
      } else {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error as Error)
    }
  }

  private validate (httpRequest: HttpRequest): Error | undefined {
    const validators = ValidationBuilder
      .of({ value: httpRequest.token, fieldName: 'token' })
      .required()
      .build()
    return new ValidationComposite(validators).validate()
  }
}
