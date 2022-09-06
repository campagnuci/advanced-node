import { SaveUserPicture } from '@/domain/contracts/repos'
import { PgUser } from '@/infra/repos/postgres/entities'
import { getRepository } from 'typeorm'

export class PgUserProfileRepository implements SaveUserPicture {
  async savePicture ({ id, imageUrl, initials }: SaveUserPicture.Params): Promise<void> {
    const pgUserRepo = getRepository(PgUser)
    await pgUserRepo.update({ id: parseInt(id) }, { imageUrl, initials })
  }
}
