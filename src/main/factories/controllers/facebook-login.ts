import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthentication } from '@/main/factories/usecases/'

export const makeFacebookLoginController = async (): Promise<FacebookLoginController> => {
  return new FacebookLoginController(await makeFacebookAuthentication())
}
