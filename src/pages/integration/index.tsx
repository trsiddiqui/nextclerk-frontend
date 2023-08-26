// ** MUI Imports
import { Grid, IconButton } from '@mui/material'

// ** Styled Component Import

import { getAuth } from 'src/utils/apiClient'
import { AddAlarmRounded } from '@mui/icons-material'

const Integration = () => {
  const handleAuthRoute = async () => {
    await getAuth(true)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
    >
      <Grid item xs={10} md={1} lg={1}>
        <IconButton aria-label='delete' size='large' onClick={handleAuthRoute}>
          <AddAlarmRounded fontSize='large' />
        </IconButton>
      </Grid>
    </div>
  )
}

export default Integration
