import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/usecases/facebook-authentication'
import { makePgUserAccountRepository } from '@/main/factories/repos'
import { makeFacebookApi, makeJwtTokenHandler } from '@/main/factories/gateways'

export const makeFacebookAuthentication = async (): Promise<FacebookAuthentication> => {
  return await setupFacebookAuthentication(makeFacebookApi(), makePgUserAccountRepository(), makeJwtTokenHandler())
}
