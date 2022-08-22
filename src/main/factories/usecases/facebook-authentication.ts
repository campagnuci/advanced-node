import { FacebookAuthenticationUsecase } from '@/domain/usecases/facebook-authentication'
import { makePgUserAccountRepository } from '@/main/factories/repos'
import { makeFacebookApi } from '@/main/factories/apis'
import { makeJwtTokenGenerator } from '@/main/factories/crypto/'

export const makeFacebookAuthentication = (): FacebookAuthenticationUsecase => {
  return new FacebookAuthenticationUsecase(makeFacebookApi(), makePgUserAccountRepository(), makeJwtTokenGenerator())
}
