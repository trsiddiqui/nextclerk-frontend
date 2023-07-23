/* eslint-disable lines-around-comment */
// ** React Imports
import React from 'react'
import { getAllCategories, searchUsers, getActiveUser, getAllLabels, createTaskApi } from 'src/utils/apiClient'
import { AutocompleteRow, DropDownRow } from 'src/@core/utils'
// import { User } from 'src/utils/types'
import TaskForm from 'src/@core/page-components/Tasks/task-form'
import { User } from 'src/utils/types'

export async function getServerSideProps() {
  // Fetch data from external API
  const categories = await getAllCategories(true)
  const labels = await getAllLabels(true)
  const users = await searchUsers(undefined, true)
  const activeUser = await getActiveUser(true)

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
      saveTaskMethod={createTaskApi}
    ></TaskForm>
  )
}

export default CreateTask
