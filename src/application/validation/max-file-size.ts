import { MaxFileSizeError } from '@/application/errors'

const MAX_FILE_SIZE_IN_MB: number = 5 * 1024 * 1024

export class MaxFileSize {
  constructor (
    private readonly maxSizeInMb: number,
    private readonly value: Buffer
  ) {}

  validate (): Error | undefined {
    if (this.value.length > MAX_FILE_SIZE_IN_MB) return new MaxFileSizeError(this.maxSizeInMb)
    return undefined
  }
}
