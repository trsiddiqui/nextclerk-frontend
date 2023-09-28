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
  createSupportingPackage,
  reserveSupportingPackageNumber,
  reserveJournalEntryNumber
} from 'src/utils/apiClient'
import { AutocompleteRow, DropDownRow } from 'src/@core/utils'
import { User } from 'src/utils/types'
import SupportingPackageForm from 'src/@core/page-components/supporting-packages/supporting-package-form'
import // GetSessionParams,
// getSession
'next-auth/react'
import { GetSessionParams, getSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
// import { Account, Profile, Session } from 'next-auth'
// import { JWT } from 'next-auth/jwt'
// import { Policies } from 'src/@core/auth'

export async function getServerSideProps(ctx: unknown) {
  // context: GetSessionParams | undefined
  // const session = (await getSession(context)) as unknown as {
  //   token: Session & JWT & Account & Profile & { groups: Array<string> }
  // }
  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false
  //     }
  //   }
  // }

  // if (!session.token.groups.includes(Policies.CREATE_SUPPORTING_PACKAGES)) {
  //   return {
  //     redirect: {
  //       destination: '/404',
  //       permanent: false
  //     }
  //   }
  // }

  // Fetch data from external API
  const categories = await getAllCategories(true)
  const accounts = await getAllAccounts(true)
  const departments = await getAllDepartments(true)
  const locations = await getAllLocations(true)
  const customers = await getAllCustomers(true)
  const labels = await getAllLabels(true)
  const users = await searchUsers(undefined, true)
  // const activeUser = await getActiveUser(true)
  const data = await getSession(ctx as GetSessionParams)
  const session = data as unknown as Session & { token: JWT; user: User }
  const activeUser = await getActiveUser(session!.token!.sub!, true)
  const supportingPackageNumber = await reserveSupportingPackageNumber(true)
  const journalEntryNumber = await reserveJournalEntryNumber(true)
  console.log('ACTIVE USER', activeUser)
  // Pass data to the page via props

  return {
    props: {
      categories,
      accounts,
      departments,
      locations,
      customers,
      activeUser,
      users,
      labels,
      supportingPackageNumber,
      journalEntryNumber
      // session
    }
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
  supportingPackageNumber,
  journalEntryNumber
}: {
  categories: Array<AutocompleteRow>
  accounts: Array<DropDownRow>
  departments: Array<DropDownRow>
  locations: Array<DropDownRow>
  customers: Array<DropDownRow>
  labels: Array<DropDownRow>
  users: User[]
  activeUser: { details: { id: string; name: string }; manager: { id: string; name: string } }
  supportingPackageNumber: number
  journalEntryNumber: number
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
      supportingPackageNumber={supportingPackageNumber}
      journalEntryNumber={journalEntryNumber}
    ></SupportingPackageForm>
  )
}

export default CreateSupportPackage
