import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'
import { getRepository } from 'typeorm'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result

type FacebookSaveParams = SaveFacebookAccountRepository.Params
type FacebookSaveResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser)

  async load (params: LoadParams): Promise<LoadResult> {
    const user = await this.pgUserRepo.findOne({ email: params.email })
    if (user !== undefined) {
      return {
        id: user?.id.toString(),
        name: user?.name ?? undefined
      }
    }
    return undefined
  }

  async saveWithFacebook ({ id, name, email, facebookId }: FacebookSaveParams): Promise<FacebookSaveResult> {
    let createdId: string
    if (id === undefined) {
      const pgUser = await this.pgUserRepo.save({ email, name, facebookId })
      createdId = pgUser.id.toString()
    } else {
      createdId = id
      await this.pgUserRepo.update({ id: parseInt(id) }, { name, facebookId })
    }
    return { id: createdId }
  }
}
