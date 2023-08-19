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

  downloadUrl?: string

  uploaded: {
    uuid: string
    downloadLink?: string
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

export type JournalEntry = {
  accountLabel?: string
  accountUUID?: string
  debitAmount?: string
  creditAmount?: string
  memo?: string
  departmentLabel?: string
  departmentUUID?: string
  locationLabel?: string
  locationUUID?: string
  customerLabel?: string
  customerUUID?: string
  uuid: string
  file?: UploadedFileProps
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
  journalEntries: JournalEntry[]
}

export type TaskResponse = {
  uuid: string
  number: string
  title: string
  description: string
  entityUUID: string
  entityName: string
  categoryUUID: string
  categoryName: string
  labelUUID: string
  supportingPackageUUID: string
  label: string
  isConfidential: boolean
  isRecurring: boolean
  date: Date
  dueDate: Date
  status: string | null
  assigneeUUID: string | null
  assigneeName: string | null
  assignerUUID: string
  assignerName: string
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  archivedBy: string | null
  archivedAt: string | null
}

export type TaskUpdate = {
  uuid: string
  labelUUID: string
  isRecurring: boolean
  isConfidential: boolean
  dueDate: Date
  date: Date
  description: string
  title: string
  categoryUUID: string
  assigneeUUID: string | null
  assignerUUID: string
}

export enum Status {
  SUBMITTED = 'SUBMITTED',
  DONE = 'DONE',
  INPROGRESS = 'INPROGRESS'
}
