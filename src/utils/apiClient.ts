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
  baseURL: 'http://localhost:3000/api/'
})

// TODO: This should come from the JWT
// Currently coming from backend seeds
const customerXRefID = 'f590257b-a925-45d3-b980-26ff13faf64e'

export const getAllCategories = async () => {
  const categories = await api.get<User[]>(`/${customerXRefID}/categories`)

  return categories.data
}

export const getAllAccounts = async (): Promise<DropDownRow[]> => {
  const accounts = await api.get<Account[]>(`/${customerXRefID}/accounts`)

  return accounts.data.map(account => ({
    label: account.label,
    id: account.uuid,
    key: account.uuid
  }))
}

export const getAllDepartments = async (): Promise<DropDownRow[]> => {
  const departments = await api.get<Department[]>(`/${customerXRefID}/departments`)

  return departments.data.map(department => ({
    label: department.label,
    id: department.uuid,
    key: department.uuid
  }))
}

export const getAllLocations = async () => {
  const locations = await api.get<Location[]>(`/${customerXRefID}/locations`)

  return locations.data.map(location => ({
    label: location.label,
    id: location.uuid,
    key: location.uuid
  }))
}

export const getAllCustomers = async () => {
  const customers = await api.get<Customer[]>(`/${customerXRefID}/customers`)

  return customers.data.map(customer => ({
    label: customer.label,
    id: customer.uuid,
    key: customer.uuid
  }))
}

export const getAllLabels = async () => {
  const labels = await api.get<Customer[]>(`/${customerXRefID}/labels`)

  return labels.data.map(label => ({
    label: label.label,
    id: label.uuid,
    key: label.uuid
  }))
}

export const searchUsers = async (str?: string): Promise<User[]> => {
  const users = await api.get<User[]>(`/${customerXRefID}/users${str ? `?search=${str}` : ''}`)

  return users.data
}

export const getActiveUser = async () => {
  const users = (await api.get<User[]>(`/${customerXRefID}/users`)).data

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

export const uploadFile = async (file: File): Promise<UploadedFileProps> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<UploadedFileProps>(`/global/${customerXRefID}/actions/upload-file`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}

export const chooseMasterFile = async (
  fileUuid: string
): Promise<{
  '@microsoft.graph.downloadUrl': string
  sharingLink: string
}> => {
  const response = await api.post<{
    '@microsoft.graph.downloadUrl': string
    sharingLink: string
  }>(`/global/${customerXRefID}/files/${fileUuid}`, {})

  return response.data
}

export const createMasterFile = async (): Promise<MasterFileUploaded> => {
  const response = await api.post<MasterFileUploaded>(`/global/${customerXRefID}/files`, {})

  return response.data
}

export const getLatestMasterFile = async (
  fileUuid: string
): Promise<{
  '@microsoft.graph.downloadUrl': string
}> => {
  const response = await api.get<{
    '@microsoft.graph.downloadUrl': string
  }>(`/global/${customerXRefID}/files/${fileUuid}`, {})

  return response.data
}

export const uploadUpdatedFile = async (file: File, fileUuid: string): Promise<void> => {
  const formData = new FormData()
  formData.append('file', file)

  await api.put(`/global/${customerXRefID}/files/${fileUuid}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const createSupportingPackage = async (supportingPackage: unknown): Promise<void> => {
  return await api.post(`/${customerXRefID}/supporting-packages`, supportingPackage)
}

export const updateSupportingPackage = async (supportingPackage: unknown): Promise<void> => {
  return await api.put(`/${customerXRefID}/supporting-packages`, supportingPackage)
}

export const getSupportingPackage = async (supportingPackageXRefID: string): Promise<SupportingPackageResponse> => {
  const response = await api.get<SupportingPackageResponse>(
    `/${customerXRefID}/supporting-packages/${supportingPackageXRefID}`
  )

  return response.data
}

export const getOnlineViewLink = async (fileUuid: string): Promise<string> => {
  const response = await api.get<string>(`/global/${customerXRefID}/files/${fileUuid}/online-link`, {})

  return response.data
}
