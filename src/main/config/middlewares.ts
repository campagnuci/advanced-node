import { Express, Request, Response, NextFunction, json } from 'express'
import cors from 'cors'

export const setupMiddlewares = (app: Express): void => {
  app.use(cors())
  app.use(json())
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.type('json')
    next()
  })
}
