import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'motty.db.elephantsql.com',
  port: 5432,
  username: 'aespihex',
  password: 'MMNidDHdRF2Ykww9jlLMLE-1ka7Qwn02',
  database: 'aespihex',
  entities: ['dist/infra/postgres/entities/index.js']
}
