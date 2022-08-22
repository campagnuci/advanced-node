import { adaptExpressRoute as adapt } from '@/infra/http'
import { makeFacebookLoginController } from '@/main/factories/controllers'
import { Router } from 'express'

export default async (router: Router): Promise<void> => {
  router.post('/login/facebook', adapt(await makeFacebookLoginController()))
}
