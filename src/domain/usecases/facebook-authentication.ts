import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repos'

type Params = { token: string }
type Result = AccessToken | AuthenticationError

type Setup = (
  facebookApi: LoadFacebookUserApi,
  userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
  crypto: TokenGenerator
) => Promise<FacebookAuthentication>
export type FacebookAuthentication = (params: Params) => Promise<Result>

export const setupFacebookAuthentication: Setup = async (facebookApi, userAccountRepo, crypto): Promise<FacebookAuthentication> => {
  return async (params: Params): Promise<Result> => {
    const fbData = await facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await userAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await userAccountRepo.saveWithFacebook(fbAccount)
      const token = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
      return new AccessToken(token)
    }
    return new AuthenticationError()
  }
}
