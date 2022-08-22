/* eslint-disable @typescript-eslint/no-misused-promises */
import { Controller } from '@/application/controllers'
import { RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = (controller: Controller): RequestHandler => {
  return async (request, response): Promise<void> => {
    const { statusCode, data } = await controller.handle({ ...request.body })
    const jsonBody = statusCode === 200 ? data : { error: data.message }
    response.status(statusCode).json(jsonBody)
  }
}
