export class RequiredFieldError extends Error {
  constructor (fieldName?: string) {
    const message = fieldName === undefined ? 'Required field is missing.' : `The field ${fieldName} is required.`
    super(message)
    this.name = 'RequiredFieldError'
  }
}
