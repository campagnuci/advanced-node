import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/usecases/facebook-authentication'
import { makePgUserAccountRepository } from '@/main/factories/repos'
import { makeFacebookApi } from '@/main/factories/apis'
import { makeJwtTokenHandler } from '@/main/factories/crypto/'

export const makeFacebookAuthentication = async (): Promise<FacebookAuthentication> => {
  return await setupFacebookAuthentication(makeFacebookApi(), makePgUserAccountRepository(), makeJwtTokenHandler())
}
