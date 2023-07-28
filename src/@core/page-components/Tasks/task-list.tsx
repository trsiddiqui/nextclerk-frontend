// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Types
import { TaskResponse } from 'src/utils/types'
import { getDateWithoutTime, getInitials } from 'src/@core/utils'
import { useRouter } from 'next/router'

const TaskList = ({ tasks, caption }: { tasks: TaskResponse[]; caption: string }) => {
  const router = useRouter()

  return (
    <Card>
      <CardHeader
        title={caption}
        titleTypographyProps={{ sx: { lineHeight: '1.2 !important', letterSpacing: '0.31px !important' } }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
        {tasks.map((task: TaskResponse, index: number) => {
          return (
            <Box
              key={task.title}
              sx={{
                display: 'flex',
                alignItems: 'center',
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
                onClick={() => {
                  router.push(`/task/${task.uuid}/edit`)
                }}
                style={{ cursor: 'pointer' }}
              >
                <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ mr: 0.5, fontWeight: 600, letterSpacing: '0.25px' }}>{task.title}</Typography>
                  </Box>
                  <Typography variant='caption' color={'error.main'} sx={{ lineHeight: 1.5 }}>
                    due:{getDateWithoutTime(task.dueDate)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default TaskList
