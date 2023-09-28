/* eslint-disable lines-around-comment */
// ** React Imports
import React from 'react'
import { getAllCategories, searchUsers, getActiveUser, getAllLabels, createTaskApi } from 'src/utils/apiClient'
import { AutocompleteRow, DropDownRow } from 'src/@core/utils'
// import { User } from 'src/utils/types'
import TaskForm from 'src/@core/page-components/Tasks/task-form'
import { User } from 'src/utils/types'
import { GetSessionParams, getSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export async function getServerSideProps(ctx: any) {
  // Fetch data from external API
  const categories = await getAllCategories(true)
  const labels = await getAllLabels(true)
  const users = await searchUsers(undefined, true)

  const data = await getSession(ctx as GetSessionParams)
  const session = data as unknown as Session & { token: JWT; user: User }
  const activeUser = await getActiveUser(session!.token!.sub!, true)

  // Pass data to the page via props
  return { props: { categories, activeUser, users, labels } }
}

const CreateTask = ({
  categories,
  users,
  labels
}: {
  categories: Array<AutocompleteRow>
  labels: Array<DropDownRow>
  users: User[]
  // activeUser: { details: { id: string; name: string }; manager: { id: string; name: string } }
}) => {
  return (
    <TaskForm
      // activeUser={activeUser}
      categories={categories}
      labels={labels}
      users={users}
      saveOrUpdateTaskMethod={createTaskApi}
    ></TaskForm>
  )
}

export default CreateTask
