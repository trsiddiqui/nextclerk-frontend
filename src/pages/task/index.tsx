// ** MUI Imports
import { Autocomplete, Grid } from '@mui/material'

// ** Styled Component Import

import { getEntity, getTasks } from 'src/utils/apiClient'
import { Entity, Status, TaskResponse } from 'src/utils/types'
import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { getMonthFromDate, getYearFromDate } from 'src/@core/utils'
import TaskList from 'src/@core/page-components/Tasks/task-list'
import MonthsStepper from 'src/@core/components/custom/months-stepper'

export async function getServerSideProps() {
  const tasks = (await getTasks(true)).filter(task => task.archivedAt === null)
  const entity = await getEntity(true)

  // Pass data to the page via props
  return { props: { tasks, entity } }
}

const TaskDashboard = ({ tasks, entity }: { tasks: TaskResponse[]; entity: Entity }) => {
  const listOfCategories = tasks.map(task => ({
    name: task.categoryName,
    uuid: task.categoryUUID
  }))

  const listOfLabels = tasks.map(task => ({
    name: task.label,
    uuid: task.labelUUID
  }))

  const listOfUsers = tasks.map(task => ({
    name: task.assigneeName,
    uuid: task.assigneeUUID
  }))
  const categories = listOfCategories.filter(
    (category, index, array) => array.findIndex(t => t.name == category.name && t.uuid == category.uuid) == index
  )
  const labels = listOfLabels.filter(
    (label, index, array) => array.findIndex(t => t.name == label.name && t.uuid == label.uuid) == index
  )
  const users = listOfUsers
    .filter((user, index, array) => array.findIndex(t => t.name == user.name && t.uuid == user.uuid) == index)
    .filter(user => user.name !== null && user.uuid !== null)

  const [selectedMonthStep, setSelectedMonthStep] = useState<number>(getMonthFromDate(new Date()))
  const selectedMonthStepper = (index: number) => {
    setSelectedMonthStep(index)
  }
  const [allCategories] = useState(categories)
  const [allLabels] = useState(labels)
  const [allUsers] = useState(users)

  const [category, setCategory] = useState<{ label: string; uuid: string } | null>(null)
  const [label, setLabel] = useState<{ label: string; uuid: string } | null>(null)
  const [user, setUser] = useState<{ label: string | null; uuid: string | null } | null>(null)
  const [filteredTasks, setFilteredTasks] = useState(tasks)

  useEffect(() => {
    setFilteredTasks(() => {
      let newTask = tasks
      if (user) {
        newTask = newTask.filter(task => task.assigneeUUID === user.uuid)
      }
      if (label) {
        newTask = newTask.filter(task => task.labelUUID === label.uuid)
      }
      if (category) {
        newTask = newTask.filter(task => task.categoryUUID === category.uuid)
      }

      return newTask
    })
  }, [user, category, label, tasks])

  return (
    <>
      <MonthsStepper
        startStep={getMonthFromDate(entity.startOfFinancialYear)}
        year={getYearFromDate(entity.startOfFinancialYear).toString()}
        selectedMonthStepper={selectedMonthStepper}
      ></MonthsStepper>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Autocomplete
            id='tags-outlined'
            options={allUsers.map(user => ({ label: user.name, uuid: user.uuid }))}
            value={user}
            onChange={(event: any, newValue: { label: string | null; uuid: string | null } | null) => {
              if (users.length) {
                setUser(newValue)
              }
            }}
            filterSelectedOptions
            renderInput={params => (
              <TextField error={user == null} variant='filled' {...params} label='Assignee' placeholder='Assignee' />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            id='tags-outlined'
            options={allCategories.map(category => ({ label: category.name, uuid: category.uuid }))}
            value={category}
            onChange={(event: any, newValue: { label: string; uuid: string } | null) => {
              setCategory(newValue)
            }}
            filterSelectedOptions
            renderInput={params => (
              <TextField
                error={category == null}
                variant='filled'
                {...params}
                label='Category'
                placeholder='Category'
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            id='tags-outlined'
            options={allLabels.map(label => ({ label: label.name, uuid: label.uuid }))}
            value={label}
            onChange={(event: any, newValue: { label: string; uuid: string } | null) => {
              setLabel(newValue)
            }}
            filterSelectedOptions
            renderInput={params => <TextField variant='filled' {...params} label='Label' placeholder='Label' />}
          />
        </Grid>
      </Grid>

      <div>
        <Grid container spacing={5} marginTop={5}>
          <Grid item xs={12} md={3} lg={3}>
            <TaskList
              tasks={filteredTasks.filter(
                task => task.assigneeUUID === null && getMonthFromDate(task.dueDate) === selectedMonthStep
              )}
              caption='ToDo'
            />
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <TaskList
              tasks={filteredTasks.filter(
                task =>
                  task.assigneeUUID !== null &&
                  getMonthFromDate(task.dueDate) === selectedMonthStep &&
                  task.taskStatus !== Status.DONE
              )}
              caption='Assigned'
            />
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <TaskList
              tasks={filteredTasks.filter(
                task => task.status === Status.SUBMITTED && getMonthFromDate(task.dueDate) === selectedMonthStep
              )}
              caption='In Progress'
            />
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <TaskList
              tasks={filteredTasks.filter(
                task =>
                  (task.status === Status.DONE || task.taskStatus === Status.DONE) &&
                  getMonthFromDate(task.dueDate) === selectedMonthStep
              )}
              caption='Done'
            />
          </Grid>

          {/* <Grid item xs={12} md={12} lg={8}>
      <DepositWithdraw />
    </Grid>
    <Grid item xs={12}>
      <Table />
    </Grid> */}
        </Grid>
      </div>
    </>
  )

  // return (
  //   <Grid container className={classes.root} spacing={3}>
  //     <Grid container className={classes.boardsWrap}>
  //       <Grid className={classes.boardsContent}>
  //         {tasks && tasks.map(task => {
  //           return (
  //             <Paper key={1} elevation={3} className={classes.boardCard}>
  //               <BoardHeader title={task.title} />
  //               <Divider />
  //               <BoardsList boards={task.boards} />
  //               <Divider className={classes.divider} />
  //               <BoardFooter />
  //             </Paper>
  //           )
  //         })}
  //       </Grid>
  //     </Grid>
  //   </Grid>
  // )

  // return (
  //   <ApexChartWrapper>
  //     <Grid item xs={10} md={3} lg={4}>
  //       <LocalizationProvider dateAdapter={AdapterDayjs}>
  //         <DatePickerWrapper>
  //           <DatePicker
  //             value={taskDate}
  //             views={['month']}
  //             onChange={setTaskDate}
  //             inputFormat='MMM'
  //             renderInput={params => <TextField variant='filled' fullWidth {...params} />}
  //           />
  //         </DatePickerWrapper>
  //       </LocalizationProvider>
  //     </Grid>
  //     <Grid container spacing={3} marginTop={5}>
  //       <Grid item xs={12} md={3} lg={3}>
  //         <TaskList
  //           tasks={tasks.filter(
  //             task => task.assigneeUUID === null && getMonthFromDate(task.dueDate) === getMonthFromDate(taskDate)
  //           )}
  //           caption='ToDo'
  //         />
  //       </Grid>
  //       <Grid item xs={12} md={3} lg={3}>
  //         <TaskList
  //           tasks={tasks.filter(
  //             task => task.assigneeUUID !== null && getMonthFromDate(task.dueDate) === getMonthFromDate(taskDate)
  //           )}
  //           caption='Assigned'
  //         />
  //       </Grid>
  //       <Grid item xs={12} md={3} lg={3}>
  //         <TaskList
  //           tasks={tasks.filter(
  //             task => task.status === Status.SUBMITTED && getMonthFromDate(task.dueDate) === getMonthFromDate(taskDate)
  //           )}
  //           caption='In Progress'
  //         />
  //       </Grid>
  //       <Grid item xs={12} md={3} lg={3}>
  //         <TaskList
  //           tasks={tasks.filter(
  //             task => task.status === Status.DONE && getMonthFromDate(task.dueDate) === getMonthFromDate(taskDate)
  //           )}
  //           caption='Done'
  //         />
  //       </Grid>

  //       {/* <Grid item xs={12} md={12} lg={8}>
  //         <DepositWithdraw />
  //       </Grid>
  //       <Grid item xs={12}>
  //         <Table />
  //       </Grid> */}
  //     </Grid>
  //     <Grid>
  //       <Fab size='medium' color='success' aria-label='add' href='/task/create/'>
  //         <AddIcon />
  //       </Fab>
  //     </Grid>
  //   </ApexChartWrapper>
  // )
}

export default TaskDashboard
