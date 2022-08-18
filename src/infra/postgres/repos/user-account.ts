import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'
import { getRepository } from 'typeorm'

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const user = await pgUserRepo.findOne({ email: params.email })
    if (user !== undefined) {
      return {
        id: user?.id.toString(),
        name: user?.name ?? undefined
      }
    }
    return undefined
  }

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    await pgUserRepo.save({
      email: params.email,
      name: params.name,
      facebookId: params.facebookId
    })
    return await Promise.resolve({ id: '' })
  }
}
