export type User = {
  firstName: string
  lastName: string
  email: string
  uuid: string
}

export type UploadedFileProps = {
  // eslint-disable-next-line lines-around-comment
  /** Name of the file on the uploader's computer. */
  originalname: string

  /** Value of the `Content-Type` header for this file. */
  mimetype: string

  /** Size of the file in bytes. */
  size: number
}
