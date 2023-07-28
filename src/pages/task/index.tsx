// ** MUI Imports
import Grid from '@mui/material/Grid'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

import { getTasks } from 'src/utils/apiClient'
import TaskList from 'src/@core/page-components/Tasks/task-list'
import { Status, TaskResponse } from 'src/utils/types'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TextField } from '@mui/material'
import { useState } from 'react'
import { getMonthFromDate } from 'src/@core/utils'

export async function getServerSideProps() {
  const tasks = await getTasks()

  // Pass data to the page via props
  return { props: { tasks } }
}

const TaskDashboard = ({ tasks }: { tasks: TaskResponse[] }) => {
  const fabStyle = {
    right: 10,
    position: 'fixed'
  }
  const [taskDate, setTaskDate] = useState<Date | null>(new Date())

  return (
    <ApexChartWrapper>
      <Grid item xs={10} md={3} lg={4}>
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
      <Grid container spacing={3} marginTop={5}>
        <Grid item xs={12} md={3} lg={4}>
          <TaskList
            tasks={tasks.filter(
              task => task.assigneeUUID === null && getMonthFromDate(task.dueDate) === getMonthFromDate(taskDate)
            )}
            caption='ToDo'
          />
        </Grid>
        <Grid item xs={12} md={3} lg={4}>
          <TaskList
            tasks={tasks.filter(
              task => task.assigneeUUID !== null && getMonthFromDate(task.dueDate) === getMonthFromDate(taskDate)
            )}
            caption='Assigned'
          />
        </Grid>
        <Grid item xs={12} md={3} lg={4}>
          <TaskList
            tasks={tasks.filter(
              task => task.status === Status.SUBMITTED && getMonthFromDate(task.dueDate) === getMonthFromDate(taskDate)
            )}
            caption='In Progress'
          />
        </Grid>
        <Grid item xs={12} md={3} lg={4}>
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
      <Fab style={fabStyle} size='medium' color='success' aria-label='add' href='/task/create/'>
        <AddIcon />
      </Fab>
    </ApexChartWrapper>
  )
}

export default TaskDashboard
