import axios from 'axios'
import {
  Account,
  Customer,
  DashboardUser,
  Department,
  Location,
  MasterFileUploaded,
  Role,
  SupportingPackageResponse,
  TaskResponse,
  TaskUpdate,
  UploadedFileProps,
  User,
  UserRequest
} from './types'
import { DropDownRow } from 'src/@core/utils'

const hostname = process.env.NODE_ENV === 'production' ? 'test.nextclerk.com' : 'localhost'

// TODO: Add proxy to the api so we dont have to expose API

const publicUrl = `http://${hostname}:3000/api`
const backendUrl = 'http://localhost:3000/api/'

const api = axios.create({
  baseURL: publicUrl
})

const backendApi = axios.create({
  baseURL: backendUrl
})

export const syncfusionWebApiUrls = (): { openUrl: string; saveUrl: string } => {
  return {
    // openUrl: `http://${hostname}:3002/api/spreadsheet/open`,
    // saveUrl: `http://${hostname}:3002/api/spreadsheet/save`
    openUrl: 'https://services.syncfusion.com/react/production/api/spreadsheet/open',
    saveUrl: 'https://services.syncfusion.com/react/production/api/spreadsheet/save'
  }
}

// TODO: This should come from the JWT
// Currently coming from backend seeds
export const customerXRefID = 'f590257b-a925-45d3-b980-26ff13faf64e'

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

export const createTaskApi = async (task: unknown, isBackend = false): Promise<void> => {
  return await (isBackend ? backendApi : api).post(`/${customerXRefID}/tasks`, task)
}

export const getTask = async (taskXRefID: string, isBackend = false): Promise<TaskResponse> => {
  const response = await (isBackend ? backendApi : api).get<TaskResponse>(`/${customerXRefID}/tasks/${taskXRefID}`)

  return response.data
}

export const archiveTask = async (taskXRefID: string, isBackend = false): Promise<TaskResponse> => {
  const response = await (isBackend ? backendApi : api).delete<TaskResponse>(`/${customerXRefID}/tasks/${taskXRefID}`)

  return response.data
}

export const getTasks = async (isBackend = false): Promise<TaskResponse[]> => {
  const response = await (isBackend ? backendApi : api).get<TaskResponse[]>(`/${customerXRefID}/tasks`)

  return response.data
}

export const updateTask = async (task: TaskUpdate, isBackend = false): Promise<void> => {
  const { uuid: taskXRefID, ...updateTask } = task

  return await (isBackend ? backendApi : api).put(`/${customerXRefID}/tasks/${taskXRefID}`, updateTask)
}

export const getAuth = async (isBackend = false): Promise<void> => {
  let baseURL = ''
  isBackend ? (baseURL = 'http://localhost:3000/') : (baseURL = `http://${hostname}:3000/`)
  console.log(baseURL)
  const authURL = axios.create({
    baseURL
  })

  authURL
    .get(`/third-party-auth/quickbooks/auth-request?entityID=${customerXRefID}`)
    .then(response => {
      window.open(response.data, '', '_blank')
    })
    .catch(error => {
      if (error.response) {
        console.log(error.response.data) // => the response payload
      }
    })
}

export const postJEToQB = async (
  journalEntryLines: unknown,
  supportingPackageXRefID: string,
  isBackend = false
): Promise<void> => {
  return await (isBackend ? backendApi : api).post(
    `/${customerXRefID}/supporting-packages/${supportingPackageXRefID}/journalEntry/post-to-erp`,
    journalEntryLines
  )
}
export const getAllRoles = async (isBackend = false): Promise<Role[]> => {
  const response = await (isBackend ? backendApi : api).get(`/user-administration/groups`)

  return response.data
}

export const getAllUsersForDashboard = async (isBackend = false): Promise<DashboardUser[]> => {
  const response = await (isBackend ? backendApi : api).get(`/user-administration/${customerXRefID}/users`)

  return response.data
}

export const updateUser = async (user: UserRequest, isBackend = false): Promise<void> => {
  return await (isBackend ? backendApi : api).put(`/user-administration/${customerXRefID}/users/${user.uuid}`, user)
}

export const logoutUser = async (userXRefID: string): Promise<void> => {
  return await api.post(`/user-administration/users/${userXRefID}/logout`)
}
