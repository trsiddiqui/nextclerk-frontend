import { DatePicker } from '@mui/lab'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Snackbar,
  Tab,
  Tabs,
  TextField
} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { getEntity, updateEntity } from 'src/utils/apiClient'
import { Entity } from 'src/utils/types'

export async function getServerSideProps() {
  const entity = await getEntity(true)

  // Pass data to the page via props
  return { props: { entity } }
}
const Company = ({ entity }: { entity?: Entity }) => {
  enum SnackBarType {
    Success = 'success',
    Error = 'error',
    Info = 'info'
  }
  const router = useRouter()
  const [name, setName] = useState(entity?.name ?? '')
  const [address, setAddress] = useState(entity?.address ?? '')
  const [ein, setEin] = useState(entity?.ein ?? '')
  const [city, setCity] = useState(entity?.city ?? '')
  const [state, setState] = useState(entity?.state ?? '')
  const [zip, setZip] = useState(entity?.zip ?? '')
  const [startOfFinancialYear, setStartOfFinancialYear] = useState<Dayjs | null>(dayjs(entity?.startOfFinancialYear))
  const [endOfFinancialYear, setEndOfFinancialYear] = useState<Dayjs | null>(dayjs(entity?.endOfFinancialYear))
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [snackBarType, setSnackBarType] = useState<SnackBarType>(SnackBarType.Success)
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const showMessage = (message: string, type: SnackBarType) => {
    setSnackBarMessage(message)
    setSnackBarType(type)
    setOpenSnackBar(true)
  }

  const handleSnackBarClose = () => {
    setSnackBarMessage('')
    setOpenSnackBar(false)
  }

  const APICallWrapper = async (method: (...args: any[]) => any, args?: any, errorMessage?: string): Promise<any> => {
    try {
      const resp = await method(...args)
      setLoading(false)

      return resp
    } catch (err) {
      console.error(err)
      setLoading(false)
      showMessage(errorMessage ?? 'An error occurred', SnackBarType.Error)
    }
  }
  const handleSaveEntity = async () => {
    setLoading(true)
    const entityObject = {
      ...entity,
      name,
      address,
      ein,
      city,
      state,
      zip,
      startOfFinancialYear,
      endOfFinancialYear
    }

    await APICallWrapper(updateEntity, [entityObject], 'An error occurred while creating task.')

    showMessage('The Entity has been saved successfully.', SnackBarType.Success)
  }

  return (
    <>
      <Grid container spacing={5}>
        <Card style={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={0}>
              <Tab label='Company' />
              <Tab
                label='Users'
                onClick={() => {
                  router.push('/settings/org-chart/users')
                }}
              />
              <Tab
                label='Roles and Permissions'
                onClick={() => {
                  router.push('/settings/org-chart/roles-permissions')
                }}
              />
            </Tabs>
          </Box>
          <CardContent>
            <Grid container spacing={5}>
              <Card>
                <form onSubmit={e => e.preventDefault()}>
                  <CardHeader title='Company Info' titleTypographyProps={{ variant: 'h6' }}></CardHeader>
                  <Divider sx={{ margin: 0 }} />
                  <CardContent>
                    <Grid container spacing={5} sx={{ marginTop: 1 }}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label='Company Name'
                          placeholder='Name of Company'
                          onChange={e => setName(e.target.value)}
                          variant='standard'
                          value={name}
                        />
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <TextField
                          fullWidth
                          id='outlined-multiline-flexible'
                          label='Address'
                          value={address}
                          multiline
                          variant='standard'
                          onChange={e => setAddress(e.target.value)}
                          maxRows={4}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label='City'
                          placeholder='City'
                          onChange={e => setCity(e.target.value)}
                          variant='standard'
                          value={city}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label='State'
                          placeholder='State'
                          onChange={e => setState(e.target.value)}
                          variant='standard'
                          value={state}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label='Zip'
                          placeholder='Zip'
                          onChange={e => setZip(e.target.value)}
                          variant='standard'
                          value={zip}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label='Ein'
                          placeholder='Ein'
                          onChange={e => setEin(e.target.value)}
                          variant='standard'
                          value={ein}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePickerWrapper>
                            <DatePicker
                              label='Start of Financial year'
                              value={startOfFinancialYear}
                              onChange={e => setStartOfFinancialYear(e)}
                              inputFormat='MM/DD/YYYY'
                              renderInput={params => <TextField variant='filled' fullWidth {...params} />}
                            />
                          </DatePickerWrapper>
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePickerWrapper>
                            <DatePicker
                              label='End of Financial year'
                              value={endOfFinancialYear}
                              onChange={e => setEndOfFinancialYear(e)}
                              inputFormat='MM/DD/YYYY'
                              renderInput={params => <TextField variant='filled' fullWidth {...params} />}
                            />
                          </DatePickerWrapper>
                        </LocalizationProvider>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Grid item xs={12}>
                    <Divider sx={{ margin: 0 }} />
                  </Grid>
                  <CardActions>
                    <Button
                      size='large'
                      type='submit'
                      sx={{ mr: 2 }}
                      variant='contained'
                      onClick={() => handleSaveEntity()}
                    >
                      Save
                    </Button>
                    <Button size='large' color='secondary' variant='outlined' onClick={() => router.back()}>
                      Cancel
                    </Button>
                  </CardActions>
                </form>
              </Card>

              <Grid item xs={12}></Grid>
            </Grid>
          </CardContent>
        </Card>
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
    </>
  )
}

export default Company
