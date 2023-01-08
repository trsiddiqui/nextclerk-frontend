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
import { Autocomplete, Box, FormControlLabel, IconButton, InputAdornment, Link, Modal, Switch } from '@mui/material'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DatePicker } from '@mui/lab'
import SendIcon from '@mui/icons-material/Send'
import TableCollapsible from 'src/views/tables/TableCollapsible'
import TableCustomized from 'src/views/tables/TableCustomized'

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  // width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,

  // p: 4,
  borderRadius: '5px'
}

interface State {
  name: string
  allCategories: { label: string; id: string }[]
  date: Dayjs | null
  tab: number
  commentsSortedBy: string
}

const CreateTask = () => {
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

  // Handle state changes
  const handleStateChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleChange = (newValue: Dayjs | null) => {
    setValues({ ...values, date: newValue })
  }

  return (
    <Grid container spacing={5}>
      <Card>
        <form onSubmit={e => e.preventDefault()}>
          <CardHeader title='Create a Task' titleTypographyProps={{ variant: 'h6' }}></CardHeader>
          <Divider sx={{ margin: 0 }} />
          <CardContent>
            <Grid item xs={12} sm={12} sx={{ marginTop: -2 }} textAlign='right'>
              <FormControlLabel control={<Switch defaultChecked />} label='Confidential' />
            </Grid>
            <Grid container spacing={5} sx={{ marginTop: -13 }}>
              <Grid item xs={12} sm={12} sx={{ marginTop: 1 }}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  1. Task Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label='Task title'
                  placeholder='title of task'
                  onChange={handleStateChange('name')}
                  variant='filled'
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePickerWrapper>
                    <DatePicker
                      label='Task Date'
                      inputFormat='MM/DD/YYYY'
                      value={values.date}
                      onChange={handleChange}
                      renderInput={params => <TextField variant='filled' fullWidth {...params} />}
                    />
                  </DatePickerWrapper>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePickerWrapper>
                    <DatePicker
                      label='Task Due Date'
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
                      <TextField variant='filled' {...params} label='Task Category' placeholder='Task Category' />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  2. Internal link &nbsp;&nbsp;
                  <Link component='button' variant='body2' onClick={handleJournalModalOpen}>
                    Link
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Card variant='outlined'>
                  <CardHeader title='Descriptions'></CardHeader>
                  <CardContent>
                    <TextField
                      fullWidth
                      id='outlined-multiline-flexible'
                      label='Descriptions'
                      multiline
                      variant='standard'
                      maxRows={4}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
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
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  3. Personnel
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Link component='button' variant='body2' onClick={handlePersonnelModalOpen}>
                  Select an Assigne
                </Link>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Link component='button' variant='body2' onClick={handlePersonnelModalOpen}>
                  Select Participant(s)
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  2. Attachment &nbsp;&nbsp;
                  <Link component='button' variant='body2' onClick={handleJournalModalOpen}>
                    Link
                  </Link>
                </Typography>
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
      <Modal
        open={personnelModalOpen}
        onClose={handlePersonnelModalClose}
        aria-labelledby='modal-modal-personnel'
        aria-describedby='modal-modal-personnel'
      >
        <Box sx={modalStyle}>
          <Card>
            <CardHeader title='Select a Personnel' sx={{ textAlign: 'center' }}></CardHeader>
            <CardContent>
              <TableCustomized />
            </CardContent>
            <CardActions>
              <Grid container justifyContent='flex-end'>
                <Button size='large' type='submit' variant='contained' onClick={handlePersonnelModalClose}>
                  Close
                </Button>
              </Grid>
            </CardActions>
          </Card>
        </Box>
      </Modal>
      <Modal
        open={journalModalOpen}
        onClose={handleJournalModalClose}
        aria-labelledby='modal-modal-journal'
        aria-describedby='modal-modal-journal'
      >
        <Box sx={modalStyle}>
          <Card>
            <CardHeader title='Select a Journal Entry' sx={{ textAlign: 'center' }}></CardHeader>
            <CardContent>
              <TableCollapsible />
            </CardContent>
            <CardActions>
              <Grid container justifyContent='flex-end'>
                <Button size='large' type='submit' variant='contained' onClick={handleJournalModalClose}>
                  Close
                </Button>
              </Grid>
            </CardActions>
          </Card>
        </Box>
      </Modal>
    </Grid>
  )
}

export default CreateTask
