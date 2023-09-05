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
  getSupportingPackage,
  updateSupportingPackage
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
  const categories = await getAllCategories(true)
  const accounts = await getAllAccounts(true)
  const departments = await getAllDepartments(true)
  const locations = await getAllLocations(true)
  const customers = await getAllCustomers(true)
  const labels = await getAllLabels(true)
  const users = await searchUsers(undefined, true)
  const activeUser = await getActiveUser(true)

  const supportingPackage = await getSupportingPackage(supportingPackageXRefID, true)

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
      saveSupportingPackageMethod={updateSupportingPackage}
    ></SupportingPackageForm>
  )
}

export default CreateSupportPackage
