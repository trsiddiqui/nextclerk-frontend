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

  uploaded: {
    uuid: string
  }
}

export type MasterFileUploaded = UploadedFileProps & {
  downloadUrl: string
  sharingLink?: string
}

export type ServerFileAddress = {
  content: string
}

export interface Account {
  id: number
  internalID: string
  integrationID: string
  entityID: string
  accountNumber: string
  uuid: string
  label: string
}

export interface Department {
  id: number
  internalID: string
  integrationID: string
  entityID: string
  uuid: string
  label: string
}

export interface Customer {
  id: number
  internalID: string
  integrationID: string
  entityID: string
  uuid: string
  label: string
}

export interface Location {
  id: number
  internalID: string
  integrationID: string
  entityID: string
  uuid: string
  label: string
}
