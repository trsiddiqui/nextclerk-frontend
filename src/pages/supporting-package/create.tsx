/* eslint-disable lines-around-comment */
// ** React Imports
import React from 'react'
import {
  getAllAccounts,
  getAllCategories,
  getAllCustomers,
  getAllDepartments,
  getAllLocations,
  searchUsers,
  getActiveUser,
  getAllLabels,
  createSupportingPackage
} from 'src/utils/apiClient'
import { AutocompleteRow, DropDownRow } from 'src/@core/utils'
import { User } from 'src/utils/types'
import SupportingPackageForm from 'src/@core/page-components/supporting-packages/supporting-package-form'

export async function getServerSideProps() {
  // Fetch data from external API
  const categories = await getAllCategories(true)
  const accounts = await getAllAccounts(true)
  const departments = await getAllDepartments(true)
  const locations = await getAllLocations(true)
  const customers = await getAllCustomers(true)
  const labels = await getAllLabels(true)
  const users = await searchUsers(undefined, true)
  const activeUser = await getActiveUser(true)

  // Pass data to the page via props
  return { props: { categories, accounts, departments, locations, customers, activeUser, users, labels } }
}

const CreateSupportPackage = ({
  categories,
  accounts,
  departments,
  locations,
  customers,
  activeUser,
  users,
  labels
}: {
  categories: Array<AutocompleteRow>
  accounts: Array<DropDownRow>
  departments: Array<DropDownRow>
  locations: Array<DropDownRow>
  customers: Array<DropDownRow>
  labels: Array<DropDownRow>
  users: User[]
  activeUser: { details: { id: string; name: string }; manager: { id: string; name: string } }
}) => {
  return (
    <SupportingPackageForm
      accounts={accounts}
      activeUser={activeUser}
      categories={categories}
      customers={customers}
      departments={departments}
      labels={labels}
      locations={locations}
      users={users}
      saveSupportingPackageMethod={createSupportingPackage}
    ></SupportingPackageForm>
  )
}

export default CreateSupportPackage