import { PgUserProfileRepository } from '@/infra/repos/postgres'
import { PgUser } from '@/infra/repos/postgres/entities'
import { IBackup } from 'pg-mem'
import { getRepository, Repository, getConnection } from 'typeorm'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'

describe('PSQL UserProfile Repository', () => {
  let sut: PgUserProfileRepository
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
    sut = new PgUserProfileRepository()
  })

  describe('savePicture()', () => {
    test('should update user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email@mail.com', initials: 'any_initials' })
      await sut.savePicture({ id: id.toString(), imageUrl: 'any_url', initials: undefined })
      const newUser = await pgUserRepo.findOne({ id })
      expect(newUser).toMatchObject({ id, imageUrl: 'any_url', initials: null })
    })
  })

  describe('load()', () => {
    test('should load user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email@mail.com', name: 'any_name' })
      const userProfile = await sut.load({ id: id.toString() })
      expect(userProfile?.name).toBe('any_name')
    })
  })
})
