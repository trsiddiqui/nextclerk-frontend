import axios from 'axios'
import { Account, Customer, Department, Location, UploadedFileProps, User } from './types'
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

export const searchUsers = async (str?: string): Promise<User[]> => {
  const users = await api.get<User[]>(`/${customerXRefID}/users${str ? `?search=${str}` : ''}`)

  return users.data
}

export const getActiveUser = async () => {
  return Promise.resolve({
    details: {
      id: 'xyz-asd-vnkd',
      name: 'Taha Siddiqui'
    },
    manager: {
      id: 'abcd-efg-hijkl',
      name: 'Majid Razmjoo'
    }
  })
}

export const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<UploadedFileProps>('/global/actions/upload-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  if (response.status === 200) {
    return response.data
  } else {
    // TODO: Find a way to handle error in a better way
    throw new Error('An error occurred')
  }
}
