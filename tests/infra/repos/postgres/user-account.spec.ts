import { PgUserAccountRepository } from '@/infra/repos/postgres'
import { PgUser } from '@/infra/repos/postgres/entities'
import { IBackup } from 'pg-mem'
import { getRepository, Repository, getConnection } from 'typeorm'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'

describe('PSQL UserAccount Repository', () => {
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

  describe('load()', () => {
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

  describe('saveWithFacebook()', () => {
    test('should create an account if id is undefined', async () => {
      const account = await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })
      const user = await pgUserRepo.findOne({ email: 'any_email' })
      expect(user?.id).toBe(1)
      expect(account.id).toBe('1')
    })

    test('should update account if id is defined', async () => {
      await pgUserRepo.save({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })
      const account = await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })
      const user = await pgUserRepo.findOne({ id: 1 })
      expect(user).toEqual({
        id: 1,
        email: 'any_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })
      expect(account.id).toBe('1')
    })
  })
})
