/* eslint-disable lines-around-comment */
// ** React Imports
import React from 'react'
import { getAllCategories, searchUsers, getActiveUser, getAllLabels, getTask, updateTask } from 'src/utils/apiClient'
import { AutocompleteRow, DropDownRow } from 'src/@core/utils'
// import { User } from 'src/utils/types'
import TaskForm from 'src/@core/page-components/Tasks/task-form'
import { TaskResponse, User } from 'src/utils/types'

export async function getServerSideProps({ params: { taskXRefID } }: { params: { taskXRefID: string } }) {
  // Fetch data from external API
  const categories = await getAllCategories(true)
  const labels = await getAllLabels(true)
  const users = await searchUsers(undefined, true)
  const activeUser = await getActiveUser(true)

  const task = await getTask(taskXRefID, true)

  // Pass data to the page via props
  return { props: { categories, activeUser, users, labels, task } }
}

const EditTask = ({
  categories,
  users,
  labels,
  task
}: {
  categories: Array<AutocompleteRow>
  labels: Array<DropDownRow>
  users: User[]
  task?: TaskResponse
  // activeUser: { details: { id: string; name: string }; manager: { id: string; name: string } }
}) => {
  return (
    <TaskForm
      // activeUser={activeUser}
      categories={categories}
      labels={labels}
      users={users}
      task={task}
      saveTaskMethod={updateTask}
    ></TaskForm>
  )
}

export default EditTask
