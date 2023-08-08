import React from 'react'
import { Grid, Typography } from '@mui/material'

const headerStyle = {
  boardHeader: {
    padding: '10px',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}

export const BoardHeader = ({ title }: { title: string }) => {
  return (
    <Grid container style={headerStyle.boardHeader}>
      <Typography component='h5' variant='h5'>
        {title}
      </Typography>
    </Grid>
  )
}
