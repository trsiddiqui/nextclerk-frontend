import React from 'react'
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'
import { TaskResponse } from 'src/utils/types'
import { DeleteCircle } from 'mdi-material-ui'
import { getDateWithoutTime, getInitials } from 'src/@core/utils'
import { useRouter } from 'next/router'
import { archiveTask } from 'src/utils/apiClient'

const style = {
  boardCard: {
    width: '380px',
    display: 'flex',
    maxHeight: '100%',
    overflowX: 'hidden',
    overflowY: 'hidden',
    marginLeft: '8px',
    marginRight: '8px',
    flexDirection: 'column'

    // [theme.breakpoints.down('sm')]: {
    //   width: '300px'
    // }
  },
  boardHeader: {
    padding: '2px',

    // padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  boardHeaderButton: {
    marginRight: '-12px'
  },
  boardButton: {
    padding: '10px',
    justifyContent: 'center'
  },
  divider: {
    marginTop: '10px'
  },

  cardRoot: {
    margin: '10px',
    marginBottom: 10,
    borderLeft: '5px solid green'
  },
  details: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto',
    paddingBottom: '10px'
  },

  // cover: {
  //   width: 151,
  // },
  bottomBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px'
  }
}

export const Task = ({ task }: { task: TaskResponse }) => {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  const handleDeleteOpen = () => {
    setOpen(true)
  }

  const handleDeleteClose = () => {
    setOpen(false)
  }

  const handleDeleteTask = async ({ taskUUID }: { taskUUID: string }) => {
    // await APICallWrapper(deleteTaskMethod, [taskUUID], 'An error occurred while deleting task. Please contact support.')
    await archiveTask(taskUUID)
    setOpen(false)
    router.reload()
  }

  return (
    <Card variant='outlined' style={style.cardRoot}>
      <div>
        <CardContent style={style.content}>
          <Box
            onClick={() => {
              router.push(`/task/${task.uuid}/edit`)
            }}
            sx={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            style={{ cursor: 'pointer' }}
          >
            <Typography component='h5' variant='h6'>
              {task.title}
            </Typography>
            {/* <Grid item xs={12}>
      <Box component='small' m={1}>
        <Typography variant='body2'>{task.uuid}</Typography>
      </Box>
    </Grid> */}
            <Grid item xs={12} style={style.bottomBox}>
              {task.categoryName && <Chip size='small' label={task.categoryName} />}
              {/* <AvatarGroup max={4} style={style.}>
    {board.members.map(item => {
      return <Avatar key={item.id} alt={item.name} src={`/${item.avatar}.jpg`} />
    })}
  </AvatarGroup> */}
            </Grid>
            <Avatar
              sx={{
                width: 38,
                height: 38,
                marginRight: 3,
                marginTop: 5,
                fontSize: '1rem',
                color: 'common.white',
                backgroundColor: 'gray'
              }}
            >
              {getInitials(task.assignerName)}
            </Avatar>

            <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' color={'error.main'} sx={{ lineHeight: 1.5 }}>
                due:{getDateWithoutTime(task.dueDate)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', textAlign: 'end', flexDirection: 'column' }}>
            <IconButton
              size='small'
              aria-label='settings'
              className='card-more-options'
              sx={{ color: 'text.secondary' }}
              onClick={handleDeleteOpen}
            >
              <DeleteCircle />
            </IconButton>
          </Box>
        </CardContent>
      </div>
      <Dialog
        open={open}
        onClose={handleDeleteClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Delete Task?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>Do you really want to delete this Task?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} autoFocus>
            Disagree
          </Button>
          <Button
            onClick={() => {
              handleDeleteTask({ taskUUID: task.uuid })
            }}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}
