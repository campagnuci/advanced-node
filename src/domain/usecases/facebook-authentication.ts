import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repos'

type Params = { token: string }
type Result = { accessToken: string }

type Setup = (
  facebookApi: LoadFacebookUserApi,
  userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
  crypto: TokenGenerator
) => Promise<FacebookAuthentication>
export type FacebookAuthentication = (params: Params) => Promise<Result>

export const setupFacebookAuthentication: Setup = async (facebookApi, userAccountRepo, crypto): Promise<FacebookAuthentication> => async (params) => {
  const fbData = await facebookApi.loadUser(params)
  if (fbData === undefined) throw new AuthenticationError()
  const accountData = await userAccountRepo.load({ email: fbData.email })
  const fbAccount = new FacebookAccount(fbData, accountData)
  const { id } = await userAccountRepo.saveWithFacebook(fbAccount)
  const accessToken = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
  return { accessToken }
}
