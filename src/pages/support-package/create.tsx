// ** React Imports
import React, { ChangeEvent, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'

// ** Icons Imports
import {
  Autocomplete,
  Avatar,
  Box,
  Chip,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Modal,
  Select,
  SpeedDial,
  SpeedDialAction,
  Switch,
  Tab,
  Tabs,
  useTheme
} from '@mui/material'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DatePicker } from '@mui/lab'
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import DownloadIcon from '@mui/icons-material/Download'
import GridOnIcon from '@mui/icons-material/GridOn'
import LinkIcon from '@mui/icons-material/Link'

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '5px'
}

interface State {
  name: string
  allCategories: { label: string; id: string }[]
  date: Dayjs | null
  tab: number
  commentsSortedBy: string
}

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const CreateSupportPackage = () => {
  const theme = useTheme()
  const [values, setValues] = useState<State>({
    name: '',
    allCategories: [
      {
        label: 'Category 1',
        id: '1'
      },
      {
        label: 'Category 2',
        id: '2'
      },
      {
        label: 'Category 3',
        id: '3'
      },
      {
        label: 'Category 4',
        id: '4'
      }
    ],
    date: dayjs(),
    tab: 0,
    commentsSortedBy: 'dateAsc'
  })
  const [personnelModalOpen, setPersonnelModalOpen] = React.useState(false)
  const [journalModalOpen, setJournalModalOpen] = React.useState(false)
  const handlePersonnelModalOpen = () => setPersonnelModalOpen(true)
  const handlePersonnelModalClose = () => setPersonnelModalOpen(false)
  const handleJournalModalOpen = () => setJournalModalOpen(true)
  const handleJournalModalClose = () => setJournalModalOpen(false)

  // Handle Password
  const handleStateChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleChange = (newValue: Dayjs | null) => {
    setValues({ ...values, date: newValue })
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValues({ ...values, tab: newValue })
  }

  return (
    <Grid container spacing={5}>
      <Card>
        <form onSubmit={e => e.preventDefault()}>
          <CardHeader title='Create a Supporting Package' titleTypographyProps={{ variant: 'h6' }}></CardHeader>
          <Divider sx={{ margin: 0 }} />
          <CardContent>
            <Grid item xs={12} sm={12} sx={{ marginTop: -2 }} textAlign='right'>
              <FormControlLabel control={<Switch defaultChecked />} label='Confidential' />
            </Grid>
            <Grid container spacing={5} sx={{ marginTop: -13 }}>
              <Grid item xs={12} sm={12} sx={{ marginTop: 1 }}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  1. Package Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label='Support Name'
                  placeholder='Name of Support Package'
                  onChange={handleStateChange('name')}
                  variant='filled'
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label='Support Period' placeholder='Q1 2022' variant='filled' />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth type='number' label='Support Number' placeholder='R32938' variant='filled' />
              </Grid>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePickerWrapper>
                    <DatePicker
                      label='Support Date'
                      inputFormat='MM/DD/YYYY'
                      value={values.date}
                      onChange={handleChange}
                      renderInput={params => <TextField variant='filled' fullWidth {...params} />}
                    />
                  </DatePickerWrapper>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth>
                  <Autocomplete
                    multiple
                    id='tags-outlined'
                    options={values.allCategories}
                    getOptionLabel={option => option.label}
                    filterSelectedOptions
                    renderInput={params => (
                      <TextField variant='filled' {...params} label='Support Category' placeholder='Support Category' />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  2. Link to a Journal &nbsp;&nbsp;
                  <Link component='button' variant='body2' onClick={handleJournalModalOpen}>
                    Link
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  variant='filled'
                  fullWidth
                  label='Journal Number'
                  placeholder='Name of Support Package'
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField variant='filled' fullWidth label='Labels' placeholder='Assign Labels' />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  3. Personnel
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Link component='button' variant='body2' onClick={handlePersonnelModalOpen}>
                  Select an Approver
                </Link>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Link component='button' variant='body2' onClick={handlePersonnelModalOpen}>
                  Select Participant(s)
                </Link>
              </Grid>
            </Grid>
          </CardContent>
          <Grid item xs={12}>
            <Divider sx={{ margin: 0 }} />
          </Grid>
          <CardActions>
            <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
              Save
            </Button>
            <Button size='large' color='secondary' variant='outlined'>
              Cancel
            </Button>
          </CardActions>
        </form>
      </Card>

      <Grid item xs={12}></Grid>
      <Card>
        <Grid item xs={12} sm={12}>
          <Box sx={{ position: 'fixed', mt: 3, height: 320, right: 30, top: '46%' }}>
            <SpeedDial ariaLabel='SpeedDial playground example' icon={<AttachFileIcon />} direction='down'>
              <SpeedDialAction key={'Excel'} icon={<GridOnIcon />} tooltipTitle='Create Excel File' />
              <SpeedDialAction key={'Sheet'} icon={<GridOnIcon />} tooltipTitle='Create Google Sheet' />
              <SpeedDialAction key={'Attach'} icon={<AttachFileIcon />} tooltipTitle='Attach' />
              <SpeedDialAction key={'Link'} icon={<LinkIcon />} tooltipTitle='Link' />
            </SpeedDial>
          </Box>
          <Box>
            <Tabs
              value={values.tab}
              onChange={handleTabChange}
              variant='fullWidth'
              aria-label='full width tabs example'
              sx={{ margin: '10px 200px' }}
            >
              <Tab label='Communication' />
              <Tab label='Journal' />
            </Tabs>
            <TabPanel value={values.tab} index={0} dir={theme.direction}>
              <Grid item xs={12} sm={12}>
                <Card variant='outlined'>
                  <CardHeader title='Add Your Comments'></CardHeader>
                  <CardContent>
                    <TextField
                      fullWidth
                      id='outlined-multiline-flexible'
                      label='Comments'
                      multiline
                      variant='standard'
                      maxRows={4}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton color='primary'>
                              <AttachFileIcon />
                            </IconButton>

                            <IconButton edge='end' color='primary'>
                              <SendIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid container justifyContent='flex-end' xs={12} sm={12}>
                <FormControl variant='standard' sx={{ m: 1, minWidth: 120, margin: 5 }}>
                  <InputLabel id='demo-simple-select-filled-label'>Sort By</InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={values.commentsSortedBy}
                    onChange={event => {
                      setValues({ ...values, commentsSortedBy: event.target.value })
                    }}
                  >
                    <MenuItem value={'dateAsc'}>Earliest First</MenuItem>
                    <MenuItem value={'dateDesc'}>Latest First</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid container spacing={2} sx={{ marginTop: -12 }}>
                <Grid item>
                  <Avatar alt='Remy Sharp'>RS</Avatar>
                </Grid>
                <Grid justifyContent='left' item xs zeroMinWidth>
                  <h4 style={{ margin: 0, textAlign: 'left' }}>Michel Michel</h4>
                  <p style={{ textAlign: 'left' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean luctus ut est sed faucibus. Duis
                    bibendum ac ex vehicula laoreet. Suspendisse congue vulputate lobortis. Pellentesque at interdum
                    tortor. Quisque arcu quam, malesuada vel mauris et, posuere sagittis ipsum. Aliquam ultricies a
                    ligula nec faucibus. In elit metus, efficitur lobortis nisi quis, molestie porttitor metus.
                    Pellentesque et neque risus. Aliquam vulputate, mauris vitae tincidunt interdum, mauris mi vehicula
                    urna, nec feugiat quam lectus vitae ex.{' '}
                  </p>
                  <p style={{ textAlign: 'left', color: 'gray' }}>
                    12th December, 2022 1:23PM
                    <Chip
                      label='Attachment1'
                      color='primary'
                      avatar={<Avatar color='secondary'>PDF</Avatar>}
                      onClick={() => alert('Download This')}
                      onDelete={() => alert('Download This')}
                      deleteIcon={<DownloadIcon />}
                      sx={{ marginLeft: 2 }}
                    />
                    <Chip
                      label='Attachment2'
                      color='primary'
                      avatar={<Avatar color='secondary'>XLS</Avatar>}
                      onClick={() => alert('Download This')}
                      onDelete={() => alert('Download This')}
                      deleteIcon={<DownloadIcon />}
                      sx={{ marginLeft: 2 }}
                    />
                  </p>
                </Grid>
              </Grid>
              <Divider variant='fullWidth' style={{ margin: '30px 0' }} />
              <Grid container wrap='nowrap' spacing={2}>
                <Grid item>
                  <Avatar alt='Remy Sharp'>RS</Avatar>
                </Grid>
                <Grid justifyContent='left' item xs zeroMinWidth>
                  <h4 style={{ margin: 0, textAlign: 'left' }}>Michel Michel</h4>
                  <p style={{ textAlign: 'left' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean luctus ut est sed faucibus. Duis
                    bibendum ac ex vehicula laoreet. Suspendisse congue vulputate lobortis. Pellentesque at interdum
                    tortor. Quisque arcu quam, malesuada vel mauris et, posuere sagittis ipsum. Aliquam ultricies a
                    ligula nec faucibus. In elit metus, efficitur lobortis nisi quis, molestie porttitor metus.
                    Pellentesque et neque risus. Aliquam vulputate, mauris vitae tincidunt interdum, mauris mi vehicula
                    urna, nec feugiat quam lectus vitae ex.{' '}
                  </p>
                  <p style={{ textAlign: 'left', color: 'gray' }}>12th December, 2022 1:23PM</p>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={values.tab} index={1} dir={theme.direction}>
              <Grid item xs={12} sm={12}>
                TO DO
              </Grid>
            </TabPanel>
          </Box>
        </Grid>
        <Divider sx={{ margin: 0 }} />
      </Card>
      <Modal
        open={personnelModalOpen}
        onClose={handlePersonnelModalClose}
        aria-labelledby='modal-modal-personnel'
        aria-describedby='modal-modal-personnel'
      >
        <Box sx={modalStyle}>
          <Typography id='modal-modal-personnel' variant='h6' component='h2'>
            Select a Personnel
          </Typography>
          <Typography id='modal-modal-personnel' sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
      <Modal
        open={journalModalOpen}
        onClose={handleJournalModalClose}
        aria-labelledby='modal-modal-personnel'
        aria-describedby='modal-modal-personnel'
      >
        <Box sx={modalStyle}>
          <Typography id='modal-modal-personnel' variant='h6' component='h2'>
            Select a Journal Entry
          </Typography>
          <Typography id='modal-modal-personnel' sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </Grid>
  )
}

export default CreateSupportPackage