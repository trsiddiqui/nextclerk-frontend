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
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
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

interface State {
  name: string
  allCategories: { label: string; id: string }[]
  date: Dayjs | null
  tab: number
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

const EditSupportPackage = () => {
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
    tab: 0
  })

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
            <Grid container spacing={5}>
              <Grid item xs={12} sm={8} sx={{ marginTop: 1 }}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  1. Package Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} textAlign='right'>
                <FormControlLabel control={<Switch defaultChecked />} label='Confidential' />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label='Support Name'
                  placeholder='Name of Support Package'
                  onChange={handleStateChange('name')}
                  variant='standard'
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label='Support Period' placeholder='Q1 2022' variant='standard' />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth type='number' label='Support Number' placeholder='R32938' variant='standard' />
              </Grid>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePickerWrapper>
                    <DatePicker
                      label='Date desktop'
                      inputFormat='MM/DD/YYYY'
                      value={values.date}
                      onChange={handleChange}
                      renderInput={params => <TextField variant='standard' fullWidth {...params} />}
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
                      <TextField variant='standard' {...params} label='Select Tag(s)' placeholder='Tag(s)' />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  2. Link to a Journal &nbsp;&nbsp;<Link>Link</Link>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  variant='standard'
                  fullWidth
                  label='Journal Number'
                  placeholder='Name of Support Package'
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField variant='standard' fullWidth label='Labels' placeholder='Assign Labels' />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  3. Personnel
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Link component='button' variant='body2'>
                  Select an Approver
                </Link>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Link component='button' variant='body2'>
                  Select Participant(s)
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ margin: 0 }} />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
              Submit
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
                <Card>
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
              <Card style={{ padding: '40px 20px' }}>
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
                      Pellentesque et neque risus. Aliquam vulputate, mauris vitae tincidunt interdum, mauris mi
                      vehicula urna, nec feugiat quam lectus vitae ex.{' '}
                    </p>
                    <p style={{ textAlign: 'left', color: 'gray' }}>12th December, 2022 1:23PM</p>
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
                      Pellentesque et neque risus. Aliquam vulputate, mauris vitae tincidunt interdum, mauris mi
                      vehicula urna, nec feugiat quam lectus vitae ex.{' '}
                    </p>
                    <p style={{ textAlign: 'left', color: 'gray' }}>12th December, 2022 1:23PM</p>
                  </Grid>
                </Grid>
              </Card>
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
    </Grid>
  )
}

export default EditSupportPackage
