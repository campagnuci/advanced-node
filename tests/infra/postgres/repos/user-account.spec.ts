import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { PgUser } from '@/infra/postgres/entities'
import { IBackup } from 'pg-mem'
import { getRepository, Repository, getConnection } from 'typeorm'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'

describe('PSQL UserAccount Repository', () => {
  describe('load()', () => {
    let sut: PgUserAccountRepository
    let pgUserRepo: Repository<PgUser>
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb([PgUser])
      backup = db.backup()
      pgUserRepo = getRepository(PgUser)
    })

    afterAll(async () => {
      await getConnection().close()
    })

    beforeEach(() => {
      backup.restore()
      sut = new PgUserAccountRepository()
    })

    test('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'existing_email' })
      const account = await sut.load({ email: 'existing_email' })
      expect(account).toEqual({ id: '1' })
    })

    test('should return undefined if email does not exist', async () => {
      const account = await sut.load({ email: 'new_email' })
      expect(account).toBeUndefined()
    })
  })
})
