import axios from 'axios'
import {
  Account,
  Customer,
  Department,
  Location,
  MasterFileUploaded,
  SupportingPackageResponse,
  UploadedFileProps,
  User
} from './types'
import { DropDownRow } from 'src/@core/utils'

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'http://test.nextclerk.com:3000/api' : 'http://localhost:3000/api/'
})

const backendApi = axios.create({
  baseURL: 'http://localhost:3000/api/'
})

// TODO: This should come from the JWT
// Currently coming from backend seeds
const customerXRefID = 'f590257b-a925-45d3-b980-26ff13faf64e'

export const getAllCategories = async (isBackend = false) => {
  const categories = await (isBackend ? backendApi : api).get<User[]>(`/${customerXRefID}/categories`)

  return categories.data
}

export const getAllAccounts = async (isBackend = false): Promise<DropDownRow[]> => {
  const accounts = await (isBackend ? backendApi : api).get<Account[]>(`/${customerXRefID}/accounts`)

  return accounts.data.map(account => ({
    label: account.label,
    id: account.uuid,
    key: account.uuid
  }))
}

export const getAllDepartments = async (isBackend = false): Promise<DropDownRow[]> => {
  const departments = await (isBackend ? backendApi : api).get<Department[]>(`/${customerXRefID}/departments`)

  return departments.data.map(department => ({
    label: department.label,
    id: department.uuid,
    key: department.uuid
  }))
}

export const getAllLocations = async (isBackend = false) => {
  const locations = await (isBackend ? backendApi : api).get<Location[]>(`/${customerXRefID}/locations`)

  return locations.data.map(location => ({
    label: location.label,
    id: location.uuid,
    key: location.uuid
  }))
}

export const getAllCustomers = async (isBackend = false) => {
  const customers = await (isBackend ? backendApi : api).get<Customer[]>(`/${customerXRefID}/customers`)

  return customers.data.map(customer => ({
    label: customer.label,
    id: customer.uuid,
    key: customer.uuid
  }))
}

export const getAllLabels = async (isBackend = false) => {
  const labels = await (isBackend ? backendApi : api).get<Customer[]>(`/${customerXRefID}/labels`)

  return labels.data.map(label => ({
    label: label.label,
    id: label.uuid,
    key: label.uuid
  }))
}

export const searchUsers = async (str?: string, isBackend = false): Promise<User[]> => {
  const users = await (isBackend ? backendApi : api).get<User[]>(
    `/${customerXRefID}/users${str ? `?search=${str}` : ''}`
  )

  return users.data
}

export const getActiveUser = async (isBackend = false) => {
  const users = (await (isBackend ? backendApi : api).get<User[]>(`/${customerXRefID}/users`)).data

  return {
    details: {
      id: users[0].uuid,
      name: `${users[0].firstName} ${users[0].lastName}`
    },
    manager: {
      id: users[1].uuid,
      name: `${users[1].firstName} ${users[1].lastName}`
    }
  }
}

export const uploadFile = async (file: File, isBackend = false): Promise<UploadedFileProps> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await (isBackend ? backendApi : api).post<UploadedFileProps>(
    `/global/${customerXRefID}/actions/upload-file`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )

  return response.data
}

export const chooseMasterFile = async (
  fileUuid: string,
  isBackend = false
): Promise<{
  '@microsoft.graph.downloadUrl': string
  sharingLink: string
}> => {
  const response = await (isBackend ? backendApi : api).post<{
    '@microsoft.graph.downloadUrl': string
    sharingLink: string
  }>(`/global/${customerXRefID}/files/${fileUuid}`, {})

  return response.data
}

export const createMasterFile = async (isBackend = false): Promise<MasterFileUploaded> => {
  const response = await (isBackend ? backendApi : api).post<MasterFileUploaded>(`/global/${customerXRefID}/files`, {})

  return response.data
}

export const getLatestMasterFile = async (
  fileUuid: string,
  isBackend = false
): Promise<{
  '@microsoft.graph.downloadUrl': string
}> => {
  const response = await (isBackend ? backendApi : api).get<{
    '@microsoft.graph.downloadUrl': string
  }>(`/global/${customerXRefID}/files/${fileUuid}`, {})

  return response.data
}

export const uploadUpdatedFile = async (file: File, fileUuid: string, isBackend = false): Promise<void> => {
  const formData = new FormData()
  formData.append('file', file)

  await (isBackend ? backendApi : api).put(`/global/${customerXRefID}/files/${fileUuid}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const createSupportingPackage = async (supportingPackage: unknown, isBackend = false): Promise<void> => {
  return await (isBackend ? backendApi : api).post(`/${customerXRefID}/supporting-packages`, supportingPackage)
}

export const updateSupportingPackage = async (supportingPackage: unknown, isBackend = false): Promise<void> => {
  return await (isBackend ? backendApi : api).put(`/${customerXRefID}/supporting-packages`, supportingPackage)
}

export const getSupportingPackage = async (
  supportingPackageXRefID: string,
  isBackend = false
): Promise<SupportingPackageResponse> => {
  const response = await (isBackend ? backendApi : api).get<SupportingPackageResponse>(
    `/${customerXRefID}/supporting-packages/${supportingPackageXRefID}`
  )

  return response.data
}

export const getOnlineViewLink = async (fileUuid: string, isBackend = false): Promise<string> => {
  const response = await (isBackend ? backendApi : api).get<string>(
    `/global/${customerXRefID}/files/${fileUuid}/online-link`,
    {}
  )

  return response.data
}
