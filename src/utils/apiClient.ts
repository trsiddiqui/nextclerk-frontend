import axios from 'axios'
import { UploadedFileProps, User } from './types'

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

export const getAllAccounts = async () => {
  return Promise.resolve([
    {
      label: 'Account 1',
      key: 1,
      id: '1'
    },
    {
      label: 'Account 2',
      key: 2,
      id: '2'
    },
    {
      label: 'Account 3',
      key: 3,
      id: '3'
    },
    {
      label: 'Account 4',
      key: 4,
      id: '4'
    }
  ])
}

export const getAllDepartments = async () => {
  return Promise.resolve([
    {
      label: 'Department 1',
      key: 1,
      id: '1'
    },
    {
      label: 'Department 2',
      key: 2,
      id: '2'
    },
    {
      label: 'Department 3',
      key: 3,
      id: '3'
    },
    {
      label: 'Department 4',
      key: 4,
      id: '4'
    }
  ])
}

export const getAllLocations = async () => {
  return Promise.resolve([
    {
      label: 'Location 1',
      key: 1,
      id: '1'
    },
    {
      label: 'Location 2',
      key: 2,
      id: '2'
    },
    {
      label: 'Location 3',
      key: 3,
      id: '3'
    },
    {
      label: 'Location 4',
      key: 4,
      id: '4'
    }
  ])
}

export const getAllCustomers = async () => {
  return Promise.resolve([
    {
      label: 'Customer 1',
      key: 1,
      id: '1'
    },
    {
      label: 'Customer 2',
      key: 2,
      id: '2'
    },
    {
      label: 'Customer 3',
      key: 3,
      id: '3'
    },
    {
      label: 'Customer 4',
      key: 4,
      id: '4'
    }
  ])
}

export const searchUsers = async (str: string): Promise<User[]> => {
  const users = await api.get<User[]>(`/${customerXRefID}/users?search=${str}`)

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
