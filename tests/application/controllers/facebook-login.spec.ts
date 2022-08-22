import { FacebookLoginController } from '@/application/controllers'
import { RequiredStringValidator } from '@/application/validation'
import { UnauthorizedError } from '@/application/errors'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken } from '@/domain/entities'

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: jest.Mock
  let token: string

  beforeAll(() => {
    token = 'any_token'
    facebookAuth = jest.fn()
    facebookAuth.mockResolvedValue(new AccessToken('any_value'))
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  test('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ token })
    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token')
    ])
  })

  test('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })
    expect(facebookAuth).toHaveBeenCalledWith({ token })
    expect(facebookAuth).toHaveBeenCalledTimes(1)
  })

  test('should return 401 if FacebookAuthentication fails', async () => {
    facebookAuth.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token })
    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  test('should return 200 if FacebookAuthentication succeeds', async () => {
    const httpResponse = await sut.handle({ token })
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
})
