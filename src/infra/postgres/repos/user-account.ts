import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'
import { getRepository } from 'typeorm'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result

type FacebookSaveParams = SaveFacebookAccountRepository.Params
type FacebookSaveResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load ({ email }: LoadParams): Promise<LoadResult> {
    const pgUserRepo = getRepository(PgUser)
    const user = await pgUserRepo.findOne({ email })
    if (user !== undefined) {
      return {
        id: user?.id.toString(),
        name: user?.name ?? undefined
      }
    }
    return undefined
  }

  async saveWithFacebook ({ id, name, email, facebookId }: FacebookSaveParams): Promise<FacebookSaveResult> {
    const pgUserRepo = getRepository(PgUser)
    let createdId: string
    if (id === undefined) {
      const pgUser = await pgUserRepo.save({ email, name, facebookId })
      createdId = pgUser.id.toString()
    } else {
      createdId = id
      await pgUserRepo.update({ id: parseInt(id) }, { name, facebookId })
    }
    return { id: createdId }
  }
}
