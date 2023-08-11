// ** React Imports
import React, { useState } from 'react'

// ** MUI Imports
import {
  Autocomplete,
  Avatar,
  FormControlLabel,
  Modal,
  Switch,
  Link,
  IconButton,
  InputAdornment,
  Card,
  Grid,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  CardActions,
  FormControl,
  Snackbar,
  Toolbar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Alert,
  Chip,
  Backdrop,
  CircularProgress
} from '@mui/material'

// ** Icons Imports
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DatePicker } from '@mui/lab'
import SendIcon from '@mui/icons-material/Send'
import SearchIcon from '@mui/icons-material/Search'
import { AutocompleteRow, DropDownRow, getInitials } from 'src/@core/utils'
import { TaskResponse, User } from 'src/utils/types'
import { searchUsers } from 'src/utils/apiClient'
import { StyledTableCell, StyledTableRow } from 'src/views/tables/TableCustomized'
import { useRouter } from 'next/router'

const styles = {
  modalStyle: {
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    margin: '0 auto',
    borderRadius: '5px'
  },
  personnelModalStyle: {
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,

    margin: '0 auto',
    borderRadius: '5px'
  },
  sheetModalStyle: {
    // width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    margin: '0 auto',
    borderRadius: '5px'
  },
  boldCenter: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '12pt',
    verticalAlign: 'middle',
    textDecoration: 'underline'
  }
}

const TaskForm = ({
  categories,
  labels,
  users,
  saveOrUpdateTaskMethod,
  task
}: {
  categories: Array<AutocompleteRow>
  labels: Array<DropDownRow>
  users: User[]
  saveOrUpdateTaskMethod: (...args: any) => Promise<any>
  task?: TaskResponse
}) => {
  const router = useRouter()
  enum SnackBarType {
    Success = 'success',
    Error = 'error',
    Info = 'info'
  }
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [assignee, setAssignee] = useState(task?.assigneeUUID ?? null)
  const [assigner, setAssigner] = useState(task?.assignerUUID ?? null)
  const [personnelSearchQuery, setPersonnelSearchQuery] = useState('')
  const [personnel, setPersonnel] = useState<Array<User>>(users)

  const [isConfidential, setIsConfidential] = useState<boolean>(task?.isConfidential ?? false)
  const [isRecurring, setIsRecurring] = useState<boolean>(task?.isRecurring ?? false)

  const [category, setCategory] = useState<{ label: string; uuid: string } | null>(
    task?.categoryName && task?.categoryUUID ? { label: task?.categoryName, uuid: task.categoryUUID } : null
  )
  const [date, setDate] = useState<Dayjs | null>(dayjs(task?.date))
  const [dueDate, setDueDate] = useState<Dayjs | null>(dayjs(task?.dueDate))

  // const [saveAnchorEl, setSaveAnchorEl] = React.useState<null | HTMLElement>(null)
  const [loading, setLoading] = useState(false)
  const [allCategories] = useState(categories)
  const [allLabels] = useState(labels)
  const [label, setLabel] = useState<{ label: string; uuid: string } | null>(
    task?.label && task?.labelUUID ? { label: task?.label, uuid: task.labelUUID } : null
  )
  const [personnelModalOpen, setPersonnelModalOpen] = useState(false)

  // const [personnel, setPersonnel] = useState<Array<User>>(users)
  const handlePersonnelModalClose = () => setPersonnelModalOpen(false)

  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [snackBarType, setSnackBarType] = useState<SnackBarType>(SnackBarType.Success)
  const [snackBarMessage, setSnackBarMessage] = useState('')

  // Handle state changes

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
  const handleSaveTask = async () => {
    const taskObject = {
      title,
      isConfidential,
      isRecurring,
      categoryUUID: category?.uuid,
      labelUUID: label?.uuid,
      description: description,
      date,
      dueDate,
      assigneeUUID: assignee,
      assignerUUID: assigner,
      ...(task?.uuid && {
        uuid: task.uuid
      })

      // files: attachments.map(file => ({
      //   uuid: file.uploaded.uuid,
      //   isMaster: file.uploaded.uuid === masterFile?.uploaded.uuid
      // }))
    }

    await APICallWrapper(saveOrUpdateTaskMethod, [taskObject], 'An error occurred while creating task.')

    showMessage(
      'The Task has been saved successfully. (TODO: Navigate to Task Dashboard when done)',
      SnackBarType.Success
    )
    router.push('/task')
  }

  return (
    <Grid container spacing={5}>
      <Card>
        <form onSubmit={e => e.preventDefault()}>
          <CardHeader title='Create a Task' titleTypographyProps={{ variant: 'h6' }}></CardHeader>
          <Divider sx={{ margin: 0 }} />
          <CardContent>
            <Grid container spacing={5} sx={{ marginTop: -13 }}>
              <Grid item xs={12} sm={12} sx={{ marginTop: 1 }}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  1. Task Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={7}>
                <TextField
                  fullWidth
                  label='Task title'
                  placeholder='title of task'
                  onChange={e => setTitle(e.target.value)}
                  variant='filled'
                  value={title}
                />
              </Grid>
              {/* <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePickerWrapper>
                    <DatePicker
                      label='Task Date'
                      inputFormat='MM/DD/YYYY'
                      value={date}
                      onChange={e => setDate(e)}
                      renderInput={params => <TextField variant='filled' fullWidth {...params} />}
                    />
                  </DatePickerWrapper>
                </LocalizationProvider>
              </Grid> */}
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePickerWrapper>
                    <DatePicker
                      label='Task Due Date'
                      inputFormat='MM/DD/YYYY'
                      value={dueDate}
                      onChange={e => setDueDate(e)}
                      renderInput={params => <TextField variant='filled' fullWidth {...params} />}
                    />
                  </DatePickerWrapper>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    id='tags-outlined'
                    options={allCategories.map(category => ({ label: category.name, uuid: category.uuid }))}
                    value={category}
                    onChange={(event: any, newValue: { label: string; uuid: string } | null) => {
                      setCategory(newValue)
                    }}
                    filterSelectedOptions
                    renderInput={params => (
                      <TextField variant='filled' {...params} label='Support Category' placeholder='Support Category' />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    id='tags-outlined'
                    options={allLabels.map(label => ({ label: label.label, uuid: label.id }))}
                    value={label}
                    onChange={(event: any, newValue: { label: string; uuid: string } | null) => {
                      setLabel(newValue)
                    }}
                    filterSelectedOptions
                    renderInput={params => (
                      <TextField variant='filled' {...params} label='Task Label' placeholder='Task Label' />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid container spacing={9} sx={{ marginTop: 2 }}>
                <Grid item xs={12} sm={3} textAlign='left' sx={{ marginLeft: 5 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        defaultChecked={isConfidential}
                        onChange={event => {
                          setIsConfidential(event.currentTarget.checked)
                        }}
                      />
                    }
                    label='Confidential'
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ marginTop: -2 }} textAlign='left'>
                  <FormControlLabel
                    control={
                      <Switch
                        defaultChecked={isRecurring}
                        onChange={event => {
                          setIsRecurring(event.currentTarget.checked)
                        }}
                      />
                    }
                    label='Recurring'
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Card variant='outlined'>
                  <CardHeader title='Descriptions'></CardHeader>
                  <CardContent>
                    <TextField
                      fullWidth
                      id='outlined-multiline-flexible'
                      label='Descriptions'
                      value={description}
                      multiline
                      variant='standard'
                      onChange={e => setDescription(e.target.value)}
                      maxRows={4}

                      // InputProps={{
                      //   endAdornment: (
                      //     <InputAdornment position='end'>
                      //       <IconButton edge='end' color='primary'>
                      //         <SendIcon />
                      //       </IconButton>
                      //     </InputAdornment>
                      //   )
                      // }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                {/* <Link component='button' variant='body2' onClick={handleMultiPersonnelModalOpen}>
                  <FormLabel sx={{ cursor: 'pointer', color: 'blue' }}>Participants</FormLabel>
                </Link> */}
                <Autocomplete
                  multiple
                  id='tags-standard'
                  fullWidth
                  options={users}
                  getOptionLabel={option => `${option.firstName} ${option.lastName}`}
                  onChange={(event, updatedList) => {
                    setAssigner(updatedList[0] ? updatedList[0].uuid : null)
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        avatar={
                          <Avatar>
                            {option.firstName || option.lastName
                              ? getInitials(`${option.firstName} ${option.lastName}`)
                              : ''}
                          </Avatar>
                        }
                        {...getTagProps({ index })}
                        key={index}
                        label={`${option.firstName} ${option.lastName}`}
                      />
                    ))
                  }}
                  renderInput={params => (
                    <TextField {...params} variant='standard' fullWidth label='Assignor' placeholder='Assignor' />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                {/* <Link component='button' variant='body2' onClick={handleMultiPersonnelModalOpen}>
                  <FormLabel sx={{ cursor: 'pointer', color: 'blue' }}>Participants</FormLabel>
                </Link> */}
                <Autocomplete
                  multiple
                  id='tags-standard'
                  fullWidth
                  options={users}
                  getOptionLabel={option => `${option.firstName} ${option.lastName}`}
                  onChange={(event, updatedList) => {
                    setAssignee(updatedList[0] ? updatedList[0].uuid : null)
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        avatar={
                          <Avatar>
                            {option.firstName || option.lastName
                              ? getInitials(`${option.firstName} ${option.lastName}`)
                              : ''}
                          </Avatar>
                        }
                        {...getTagProps({ index })}
                        key={index}
                        label={`${option.firstName} ${option.lastName}`}
                      />
                    ))
                  }}
                  renderInput={params => (
                    <TextField {...params} variant='standard' fullWidth label='Assignee' placeholder='Assignee' />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {/* 2. Attachment &nbsp;&nbsp;
                  <Link component='button' variant='body2' onClick={handleJournalModalOpen}>
                    Link
                  </Link> */}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <Grid item xs={12}>
            <Divider sx={{ margin: 0 }} />
          </Grid>
          <CardActions>
            <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' onClick={handleSaveTask}>
              Save
            </Button>
            {task?.title ? (
              task?.supportingPackageUUID ? (
                <Button
                  size='large'
                  type='submit'
                  sx={{ mr: 2 }}
                  variant='contained'
                  onClick={() => router.push(`/supporting-package/${task.supportingPackageUUID}/edit`)}
                >
                  CONTINUE ON SUPPORTING PACKAGE
                </Button>
              ) : (
                <Button
                  size='large'
                  type='submit'
                  sx={{ mr: 2 }}
                  variant='contained'
                  onClick={() => router.push('/supporting-package/create')}
                >
                  CREATE SUPPORTING PACKAGE
                </Button>
              )
            ) : null}

            <Button size='large' color='secondary' variant='outlined' onClick={() => router.back()}>
              Cancel
            </Button>
          </CardActions>
        </form>
      </Card>

      <Grid item xs={12}></Grid>
      <Modal open={personnelModalOpen} onClose={handlePersonnelModalClose}>
        <Card sx={styles.personnelModalStyle}>
          <CardHeader title='Select a Personnel' sx={{ textAlign: 'center' }}></CardHeader>
          <CardContent>
            <Toolbar>
              <TextField
                id='search-bar'
                className='text'
                onChange={e => {
                  setPersonnelSearchQuery(e.target.value)
                }}
                variant='outlined'
                placeholder='Search...'
                size='small'
                fullWidth
                onKeyDown={async event => {
                  if (event.key === 'Enter') {
                    setLoading(true)
                    const users = await APICallWrapper(searchUsers, [personnelSearchQuery])

                    // const users = await searchUsers(personnelSearchQuery)
                    setLoading(false)
                    setPersonnel(users)
                  }
                }}
              />
              <IconButton
                type='submit'
                aria-label='search'
                onClick={async () => {
                  setLoading(true)
                  const users = await APICallWrapper(searchUsers, [personnelSearchQuery])

                  // const users = await searchUsers(personnelSearchQuery)
                  setLoading(false)
                  setPersonnel(users)
                }}
              >
                <SearchIcon style={{ fill: 'blue' }} />
              </IconButton>
            </Toolbar>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {personnel.map(row => (
                    <StyledTableRow key={row.uuid}>
                      <StyledTableCell component='th' scope='row'>
                        <Link
                          onClick={() => {
                            // setApprover(row)
                            handlePersonnelModalClose()
                          }}
                        >
                          Select
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell component='th' scope='row'>
                        {`${row.firstName} ${row.lastName}`}
                      </StyledTableCell>
                      <StyledTableCell>{row.email}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          <CardActions>
            <Grid container justifyContent='flex-end'>
              <Button size='large' type='submit' variant='contained' onClick={handlePersonnelModalClose}>
                Close
              </Button>
            </Grid>
          </CardActions>
        </Card>
      </Modal>
      <Backdrop sx={{ color: '#fff', zIndex: 9999999 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
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
    </Grid>
  )
}

export default TaskForm
