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
  getSupportingPackage
} from 'src/utils/apiClient'
import { AutocompleteRow, DropDownRow } from 'src/@core/utils'
import { SupportingPackageResponse, User } from 'src/utils/types'
import SupportingPackageForm from 'src/@core/page-components/supporting-packages/supporting-package-form'

export async function getServerSideProps({
  params: { supportingPackageXRefID }
}: {
  params: { supportingPackageXRefID: string }
}) {
  // Fetch data from external API
  const categories = await getAllCategories()
  const accounts = await getAllAccounts()
  const departments = await getAllDepartments()
  const locations = await getAllLocations()
  const customers = await getAllCustomers()
  const labels = await getAllLabels()
  const users = await searchUsers()
  const activeUser = await getActiveUser()

  const supportingPackage = await getSupportingPackage(supportingPackageXRefID)

  // Pass data to the page via props
  return {
    props: { categories, accounts, departments, locations, customers, activeUser, users, labels, supportingPackage }
  }
}

const CreateSupportPackage = ({
  categories,
  accounts,
  departments,
  locations,
  customers,
  activeUser,
  users,
  labels,
  supportingPackage
}: {
  categories: Array<AutocompleteRow>
  accounts: Array<DropDownRow>
  departments: Array<DropDownRow>
  locations: Array<DropDownRow>
  customers: Array<DropDownRow>
  labels: Array<DropDownRow>
  users: User[]
  activeUser: { details: { id: string; name: string }; manager: { id: string; name: string } }
  supportingPackage?: SupportingPackageResponse
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
      supportingPackage={supportingPackage}
    ></SupportingPackageForm>
  )
}

export default CreateSupportPackage
