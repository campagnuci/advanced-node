import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Facebook API Integration Tests', () => {
  test('should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
    const user = await sut.loadUser({ token: 'EAAIdxjHwhIkBAGeubz80tDwZAmQeX1ANJYLgP58ZAcMfWZCxqWZBlALlXXxoXmGFiwWpYh1ZB16m9DUTjLVSEtpZAlNZBmmecZAZBRDrtWULpJvoIH2UepDGyIBytWtLbgXRH0Bn8Sk05cIZCirZBUqK7ZAdBNs5EsPI5ZBD9TkZBiYvwkfmH1DZBDRf6oGkZAm6yZBcrzC4JWulZCbR6nuQSN2krabZBGs' })
    expect(user).toEqual({
      facebookId: '110474708445035',
      email: 'vinnicius_zzmxkiq_teste@tfbnw.net',
      name: 'Vinnicius Teste'
    })
  })

  test('should return undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
    const user = await sut.loadUser({ token: 'invalid_token' })
    expect(user).toBeUndefined()
  })
})
