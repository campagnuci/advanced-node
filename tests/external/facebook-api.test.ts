import { FacebookApi, AxiosHttpClient } from '@/infra/gateways'
import { env } from '@/main/config/env'

describe('Facebook API Integration Tests', () => {
  let axiosClient: AxiosHttpClient
  let sut: FacebookApi

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
  })

  test('should return a Facebook User if token is valid', async () => {
    const user = await sut.loadUser({ token: 'EAAIdxjHwhIkBAEa3dZACZBKecQ6ZAZCrkD6qZB0qZC7cZA4TT7bF7XYnok26d1WnBpZBSBZCjaNA0ZCypWT6BKiYKJ8U9xuXJJmAUbzZCOPbrZBwsuqZBAJZCUfa5n50bZCfIjDY4cMzBoLLpUogIEZAxTJJCZBZADHfxPdpxumK0xI30A7TWlKa4rvkE4RCQHfrTkZCDZBIHYs4vDe9yFsb0QG5OowwW1FG' })
    expect(user).toEqual({
      facebookId: '110474708445035',
      email: 'vinnicius_zzmxkiq_teste@tfbnw.net',
      name: 'Vinnicius Teste'
    })
  })

  test('should return undefined if token is invalid', async () => {
    const user = await sut.loadUser({ token: 'invalid_token' })
    expect(user).toBeUndefined()
  })
})
