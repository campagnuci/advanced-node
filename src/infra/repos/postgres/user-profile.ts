import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'
import { PgUser } from '@/infra/repos/postgres/entities'
import { getRepository } from 'typeorm'

export class PgUserProfileRepository implements SaveUserPicture {
  async savePicture ({ id, imageUrl, initials }: SaveUserPicture.Params): Promise<void> {
    const pgUserRepo = getRepository(PgUser)
    await pgUserRepo.update({ id: parseInt(id) }, { imageUrl, initials })
  }

  async load ({ id }: LoadUserProfile.Params): Promise<LoadUserProfile.Result> {
    const pgUserRepo = getRepository(PgUser)
    const user = await pgUserRepo.findOne({ id: parseInt(id) })
    if (user !== undefined) {
      return { name: user.name }
    }
  }
}
