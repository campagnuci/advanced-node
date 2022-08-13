import { FacebookAuthenticationService } from '@/data/services/facebook-authentication'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Facebook Authentication Service', () => {
  let sut: FacebookAuthenticationService
  let loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>

  const token: string = 'any_token'

  beforeEach(() => {
    loadFacebookUserApiSpy = mock()
    sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)
  })

  test('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
