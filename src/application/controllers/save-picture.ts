import { ChangeProfilePicture } from '@/domain/usecases'
import { ValidationBuilder, Validator } from '@/application/validation'
import { HttpResponse, ok } from '@/application/helpers'
import { Controller } from '@/application/controllers'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error | { initials?: string, imageUrl?: string }

export class SavePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const data = await this.changeProfilePicture({ id: userId, file: file.buffer })
    return ok(data)
  }

  override buildValidators ({ file }: any): Validator[] {
    if (file === undefined) return []
    return [
      ...ValidationBuilder.of({ value: file, fieldName: 'file' })
        .required()
        .image({ allowed: ['png', 'jpg'], maxSizeInMb: 5 })
        .build()
    ]
  }
}
