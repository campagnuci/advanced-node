import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/usecases/facebook-authentication'
import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repos'
import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways'
import { AuthenticationError } from '@/domain/entities/errors'
import { mock, MockProxy } from 'jest-mock-extended'
import { AccessToken, FacebookAccount } from '@/domain/entities'

jest.mock('@/domain/entities/facebook-account')

describe('FacebookAuthentication', () => {
  let sut: FacebookAuthentication
  let facebookApi: MockProxy<LoadFacebookUser>
  let token: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccount & SaveFacebookAccount>
  let anyToken: string

  beforeAll(() => {
    anyToken = 'any_token'
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    token = mock()
    token.generate.mockResolvedValue('any_generated_token')
  })

  beforeEach(async () => {
    sut = await setupFacebookAuthentication(facebookApi, userAccountRepo, token)
  })

  test('should call LoadFacebookUser with correct params', async () => {
    await sut({ token: anyToken })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token: anyToken })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should return AuthenticationError when LoadFacebookUser returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const promise = sut({ token: anyToken })
    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  test('should call LoadUserAccountRepo when LoadFacebookUser returns data', async () => {
    await sut({ token: anyToken })
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should call SaveFacebookAccount with FacebookAccount', async () => {
    await sut({ token: anyToken })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith(jest.mocked(FacebookAccount).mock.instances[0])
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  test('should call TokenGenerator with correct params', async () => {
    await sut({ token: anyToken })
    expect(token.generate).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(token.generate).toHaveBeenCalledTimes(1)
  })

  test('should return an access token on success', async () => {
    const authResult = await sut({ token: anyToken })
    expect(authResult).toEqual({ accessToken: 'any_generated_token' })
  })

  test('should throw if LoadFacebookUser throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))
    const promise = sut({ token: anyToken })
    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  test('should throw if LoadUserAccount throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut({ token: anyToken })
    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  test('should throw if SaveFacebookAccount throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut({ token: anyToken })
    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  test('should throw if TokenGenerator throws', async () => {
    token.generate.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut({ token: anyToken })
    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
