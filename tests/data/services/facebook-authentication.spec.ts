import { FacebookAuthenticationService } from '@/data/services/facebook-authentication'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookAuthenticationService
  loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>
}

const makeSut = (): SutTypes => {
  const loadFacebookUserApiSpy = mock<LoadFacebookUserApi>()
  const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)
  return {
    sut,
    loadFacebookUserApiSpy
  }
}

describe('Facebook Authentication Service', () => {
  test('should call LoadFacebookUserApi with correct params', async () => {
    const { loadFacebookUserApiSpy, sut } = makeSut()
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { loadFacebookUserApiSpy, sut } = makeSut()
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
