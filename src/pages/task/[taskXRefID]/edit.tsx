/* eslint-disable lines-around-comment */
// ** React Imports
import React from 'react'
import { getAllCategories, searchUsers, getActiveUser, getAllLabels, getTask, updateTask } from 'src/utils/apiClient'
import { AutocompleteRow, DropDownRow } from 'src/@core/utils'
// import { User } from 'src/utils/types'
import TaskForm from 'src/@core/page-components/Tasks/task-form'
import { TaskResponse, User } from 'src/utils/types'
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

  const task = await getTask(ctx.params.taskXRefID, true)

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
      saveOrUpdateTaskMethod={updateTask}
    ></TaskForm>
  )
}

export default EditTask
