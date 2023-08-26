// ** MUI Imports
import { Grid } from '@mui/material'

// ** Styled Component Import

import { getTasks } from 'src/utils/apiClient'
import { Status, TaskResponse } from 'src/utils/types'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TextField } from '@mui/material'
import { useState } from 'react'
import { getMonthFromDate } from 'src/@core/utils'
import TaskList from 'src/@core/page-components/Tasks/task-list'

export async function getServerSideProps() {
  const tasks = (await getTasks(true)).filter(task => task.archivedAt === null)

  // Pass data to the page via props
  return { props: { tasks } }
}

const TaskDashboard2 = ({ tasks }: { tasks: TaskResponse[] }) => {
  const [taskDate, setTaskDate] = useState<Date | null>(new Date())

  return (
    <div>
      <Grid item xs={10} md={3} lg={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePickerWrapper>
            <DatePicker
              value={taskDate}
              views={['month']}
              onChange={setTaskDate}
              inputFormat='MMM'
              renderInput={params => <TextField variant='filled' fullWidth {...params} />}
            />
          </DatePickerWrapper>
        </LocalizationProvider>
      </Grid>
      <Grid container spacing={5} marginTop={5}>
        <Grid item xs={12} md={3} lg={3}>
          <TaskList
            tasks={tasks.filter(
              task => task.assigneeUUID === null && getMonthFromDate(task.dueDate) === getMonthFromDate(taskDate)
            )}
            caption='ToDo'
          />
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <TaskList
            tasks={tasks.filter(
              task => task.assigneeUUID !== null && getMonthFromDate(task.dueDate) === getMonthFromDate(taskDate)
            )}
            caption='Assigned'
          />
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <TaskList
            tasks={tasks.filter(
              task => task.status === Status.SUBMITTED && getMonthFromDate(task.dueDate) === getMonthFromDate(taskDate)
            )}
            caption='In Progress'
          />
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <TaskList
            tasks={tasks.filter(
              task => task.status === Status.DONE && getMonthFromDate(task.dueDate) === getMonthFromDate(taskDate)
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

export default TaskDashboard2
