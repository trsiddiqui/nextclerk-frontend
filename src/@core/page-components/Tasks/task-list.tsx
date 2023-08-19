import { Divider, Grid, Paper } from '@mui/material'
import { BoardHeader } from './Components/BoardHeader'
import { BoardsList } from './Components/BoardsList'
import { TaskResponse } from 'src/utils/types'

const mainStyle = {
  root: {
    padding: '2px',
    display: 'flex',
    flex: '1 1 auto',
    height: '100%'
  },
  boardsWrap: {
    display: 'flex',
    flex: '1 1 auto',
    overflowX: 'auto',
    overflowY: 'hidden',
    height: '100%'
  },
  boardsContent: {
    display: 'flex',
    paddingTop: '24px',
    paddingBottom: '24px',
    height: '100%'
  },
  boardCard: {
    width: '100%',
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
  boardButton: {
    padding: '2px',
    justifyContent: 'center'
  },
  divider: {
    marginTop: '2px'
  }
}

const TaskList = ({ tasks, caption }: { tasks: TaskResponse[]; caption: string }) => {
  return (
    <Grid container sx={mainStyle.root} spacing={1}>
      <Grid sx={mainStyle.boardsWrap}>
        <Grid sx={mainStyle.boardsContent} item xs={12} md={12} lg={12} xl={12}>
          <Paper sx={mainStyle.boardCard} elevation={3}>
            <BoardHeader title={caption} />
            <Divider />
            <BoardsList tasks={tasks} />
            <Divider style={mainStyle.divider} />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default TaskList
