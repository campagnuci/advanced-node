import { ChangeProfilePicture } from '@/domain/usecases'
import { RequiredFieldError, InvalidMimeTypeError, MaxFileSizeError } from '@/application/errors'
import { HttpResponse, badRequest, ok } from '@/application/helpers'
import { Controller } from '@/application/controllers'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error | { initials?: string, imageUrl?: string }

export class SavePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    if (file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if (file.buffer.length === 0) return badRequest(new RequiredFieldError('file'))
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['png', 'jpg', 'jpeg']))
    if (file.buffer.length > 5 * 1024 * 1024) return badRequest(new MaxFileSizeError(5))
    const data = await this.changeProfilePicture({ id: userId, file: file.buffer })
    return ok(data)
  }
}
