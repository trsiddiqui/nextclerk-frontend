export const getAllCategories = async () => {
  return Promise.resolve([
    {
      label: 'Category 1',
      key: 1,
      id: '1'
    },
    {
      label: 'Category 2',
      key: 2,
      id: '2'
    },
    {
      label: 'Category 3',
      key: 3,
      id: '3'
    },
    {
      label: 'Category 4',
      key: 4,
      id: '4'
    }
  ])
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

export const searchUsers = async (str: string) => {
  console.log('searched for ', str)

  return Promise.resolve([
    {
      id: '1',
      name: 'Taha Siddiqui',
      email: 'taha@nextclerk.com'
    },
    {
      id: '2',
      name: 'Majid Razmjoo',
      email: 'majid@nextclerk.com'
    },
    {
      id: '3',
      name: 'Amir Amiri',
      email: 'amir@nextclerk.com'
    }
  ])
}
