// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports

// ** Types
import { TaskResponse } from 'src/utils/types'
import { getDateWithoutTime, getInitials } from 'src/@core/utils'
import { useRouter } from 'next/router'
import { AlignVerticalTop, DeleteCircle } from 'mdi-material-ui'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { useState } from 'react'
import { Divider, Grid, Snackbar, colors } from '@mui/material'
import React from 'react'
import Paper from 'src/@core/theme/overrides/paper'
import { red } from '@mui/material/colors'
import { bottom } from '@popperjs/core'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const TaskList = ({ tasks, caption }: { tasks: TaskResponse[]; caption: string }) => {
  enum SnackBarType {
    Success = 'success',
    Error = 'error',
    Info = 'info'
  }
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [snackBarType, setSnackBarType] = useState<SnackBarType>(SnackBarType.Success)
  const [openSnackBar, setOpenSnackBar] = useState(false)

  const handleSnackBarClose = () => {
    setSnackBarMessage('')
    setOpenSnackBar(false)
  }

  const showMessage = (message: string, type: SnackBarType) => {
    setSnackBarMessage(message)
    setSnackBarType(type)
    setOpenSnackBar(true)
  }

  const APICallWrapper = async (method: (...args: any[]) => any, args?: any, errorMessage?: string): Promise<any> => {
    try {
      const resp = await method(...args)

      return resp
    } catch (err) {
      console.error(err)
      setLoading(false)
      showMessage(errorMessage ?? 'An error occurred', SnackBarType.Error)
    }
  }
  const handleArchiveTask = {}

  return (
    // <Grid sx={{ display: 'flex' }}>
    //   <Typography sx={{ mr: 0.5, fontWeight: 999, letterSpacing: '0.25px' }}>{caption}</Typography>
    //   <Grid>
    //     {tasks.map((task: TaskResponse, index: number) => {
    //       return (
    //         <Box
    //           key={task.title}
    //           sx={{
    //             display: 'flex',
    //             alignItems: 'center',
    //             height: 60,
    //             ...(index !== tasks.length - 1 ? { mb: 5.875 } : {})
    //           }}
    //         >
    //           <Avatar
    //             sx={{
    //               width: 38,
    //               height: 38,
    //               marginRight: 3,
    //               fontSize: '1rem',
    //               color: 'common.white',
    //               backgroundColor: 'gray'
    //             }}
    //           >
    //             {getInitials(task.assignerName)}
    //           </Avatar>

    //           <Box
    //             sx={{
    //               width: '100%',
    //               display: 'flex',
    //               flexWrap: 'wrap',
    //               alignItems: 'center',
    //               justifyContent: 'space-between'
    //             }}
    //             style={{ cursor: 'pointer' }}
    //           >
    //             <Box
    //               sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}
    //               onClick={() => {
    //                 router.push(`/task/${task.uuid}/edit`)
    //               }}
    //             >
    //               <Box sx={{ display: 'flex' }}>
    //                 <Typography sx={{ mr: 0.5, fontWeight: 600, letterSpacing: '0.25px' }}>{task.title}</Typography>
    //               </Box>
    //               <Typography variant='caption' color={'error.main'} sx={{ lineHeight: 1.5 }}>
    //                 due:{getDateWithoutTime(task.dueDate)}
    //               </Typography>
    //             </Box>
    //             <Box sx={{ display: 'flex', textAlign: 'end', flexDirection: 'column' }}>
    //               <IconButton
    //                 size='small'
    //                 aria-label='settings'
    //                 className='card-more-options'
    //                 sx={{ color: 'text.secondary' }}
    //               >
    //                 <DeleteCircle />
    //               </IconButton>
    //             </Box>
    //           </Box>
    //         </Box>
    //       )
    //     })}
    //   </Grid>
    // </Grid>

    <Card>
      <CardHeader
        title={caption}
        titleTypographyProps={{ sx: { lineHeight: '1.2 !important', letterSpacing: '0.31px !important' } }}
      />
      <Divider />
      <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
        {tasks.map((task: TaskResponse, index: number) => {
          return (
            <Box
              key={task.title}
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: 60,
                ...(index !== tasks.length - 1 ? { mb: 5.875 } : {})
              }}
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  marginRight: 3,
                  fontSize: '1rem',
                  color: 'common.white',
                  backgroundColor: 'gray'
                }}
              >
                {getInitials(task.assignerName)}
              </Avatar>

              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                style={{ cursor: 'pointer' }}
              >
                <Box
                  sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}
                  onClick={() => {
                    router.push(`/task/${task.uuid}/edit`)
                  }}
                >
                  <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ mr: 0.5, fontWeight: 600, letterSpacing: '0.25px' }}>{task.title}</Typography>
                  </Box>
                  <Typography variant='caption' color={'error.main'} sx={{ lineHeight: 1.5 }}>
                    due:{getDateWithoutTime(task.dueDate)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', textAlign: 'end', flexDirection: 'column' }}>
                  <IconButton
                    size='small'
                    aria-label='settings'
                    className='card-more-options'
                    sx={{ color: 'text.secondary' }}
                  >
                    <DeleteCircle />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackBar}
        autoHideDuration={10000}
        onClose={handleSnackBarClose}
      >
        <Alert onClose={handleSnackBarClose} severity={snackBarType} sx={{ width: '100%' }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default TaskList
