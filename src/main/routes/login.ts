import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeFacebookLoginController } from '@/main/factories/controllers'
import { Router } from 'express'

export default async (router: Router): Promise<void> => {
  router.post('/login/facebook', adapt(await makeFacebookLoginController()))
}
