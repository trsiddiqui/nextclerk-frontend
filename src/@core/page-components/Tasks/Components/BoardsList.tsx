import React from 'react'
import { Grid } from '@mui/material'
import { TaskResponse } from 'src/utils/types'
import { Task } from './Task'

export const BoardsList = ({ tasks }: { tasks: TaskResponse[] }) => {
  return (
    <Grid
      sx={{
        overflow: 'auto',
        height: '100%'
      }}
    >
      {tasks.map((task, index) => (
        <Grid key={index} item xs={12}>
          <Task task={task} />
        </Grid>
      ))}
    </Grid>
  )
}
