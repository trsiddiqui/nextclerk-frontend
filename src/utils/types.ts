export type User = {
  firstName: string
  lastName: string
  email: string
  uuid: string
}

export enum ActionItemState {
  TODO = 'TODO',
  COMPLETED = 'COMPLETED'
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
  downloadUrl?: string
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

export enum SupportingPackageUserType {
  PARTICIPANT = 'PARTICIPANT',
  APPROVER = 'APPROVER'
}

export type SupportingPackageResponse = {
  uuid: string
  number: string
  title: string
  entityUUID: string
  entityName: string
  categoryUUID: string
  categoryName: string
  labelUUID: string
  label: string
  isConfidential: boolean
  journalNumber: string | null
  isDraft: boolean
  date: Date
  users: Array<User>
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  files: {
    isMaster: boolean
    mimeType: string
    name: string
    uuid: string
    size: number

    // only available for masterFile
    downloadUrl?: string
  }[]
  communications: [
    {
      uuid: string
      text: string
      cellLink: {
        range: string
        sheet: string
      }
      isCellLinkValid: boolean
      replyToCommunicationUUID: string | null
      isChangeRequest: false
      status: ActionItemState
      createdBy: string
      createdAt: string
      updatedBy: string
      updatedAt: string
      archivedBy: string | null
      archivedAt: string | null
      users: [
        {
          firstName: string
          lastName: string
          type: 'PARTICIPANTS'
          uuid: string
        }
      ]
      attachments: [
        {
          mimeType: string
          name: string
          uuid: string
        }
      ]
    }
  ]
}
