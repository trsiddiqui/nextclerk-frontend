// ** MUI Imports
import Grid from '@mui/material/Grid'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// import { getTasks } from 'src/utils/apiClient'
import TaskList from 'src/@core/page-components/Tasks/task-list'
import { Status, TaskResponse } from 'src/utils/types'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TextField } from '@mui/material'
import { useState } from 'react'
import { getMonthFromDate } from 'src/@core/utils'

export async function getServerSideProps() {
  // const tasks = await getTasks()
  const tasks = [
    {
      entityName: 'Entity 1',
      entityUUID: 'f590257b-a925-45d3-b980-26ff13faf64e',
      supportingPackageUUID: null,
      categoryName: 'AP',
      categoryUUID: 'ca874e4a-2cca-48d1-9cba-6a0d86c8d2d6',
      label: 'Label 1',
      labelUUID: '78a32159-d09a-4e10-a293-e3939535a738',
      date: '2023-07-28T14:20:25.856Z',
      dueDate: '2023-07-28T14:20:25.856Z',
      assigneeName: null,
      assigneeUUID: null,
      description: 'Test 1',
      isConfidential: false,
      isRecurring: false,
      title: 'Test 1',
      archivedAt: null,
      archivedBy: null,
      createdAt: '2023-07-28T14:20:40.845Z',
      createdBy: 'testUser',
      updatedAt: '2023-07-28T14:20:40.846Z',
      updatedBy: 'testUser',
      assignerName: 'Majid Razmjoo',
      assignerUUID: '4981dd2b-02ad-4e99-b9fe-3d86e0abc9fa',
      uuid: '654be6dc-fa0c-4065-9043-f0fb8d43f4c8',
      parentUuid: '654be6dc-fa0c-4065-9043-f0fb8d43f4c8',
      status: null
    },
    {
      entityName: 'Entity 1',
      entityUUID: 'f590257b-a925-45d3-b980-26ff13faf64e',
      supportingPackageUUID: null,
      categoryName: 'AP',
      categoryUUID: 'ca874e4a-2cca-48d1-9cba-6a0d86c8d2d6',
      label: 'Label 1',
      labelUUID: '78a32159-d09a-4e10-a293-e3939535a738',
      date: '2023-07-28T14:20:49.180Z',
      dueDate: '2023-08-04T14:20:49.000Z',
      assigneeName: 'Taha Siddiqui',
      assigneeUUID: 'bcfcc47e-4e4d-4261-be4f-7a0a9d2dd1da',
      description: 'Test 2',
      isConfidential: false,
      isRecurring: false,
      title: 'Test 2',
      archivedAt: null,
      archivedBy: null,
      createdAt: '2023-07-28T14:21:19.465Z',
      createdBy: 'testUser',
      updatedAt: '2023-07-28T14:21:19.465Z',
      updatedBy: 'testUser',
      assignerName: 'Majid Razmjoo',
      assignerUUID: '4981dd2b-02ad-4e99-b9fe-3d86e0abc9fa',
      uuid: '90512abf-7490-414b-abba-a1c3b972ec70',
      parentUuid: '90512abf-7490-414b-abba-a1c3b972ec70',
      status: null
    }
  ]

  // Pass data to the page via props
  return { props: { tasks } }
}

const TaskDashboard = ({ tasks }: { tasks: TaskResponse[] }) => {
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
      <Grid>
        <Fab size='medium' color='success' aria-label='add' href='/task/create/'>
          <AddIcon />
        </Fab>
      </Grid>
    </ApexChartWrapper>
  )
}

export default TaskDashboard
