import './config/module-alias'
import 'reflect-metadata'
import { app } from './config/app'
import { env } from './config/env'

app.listen(env.port, () => {
  console.log(`Server running at http://localhost:${env.port}`)
})
