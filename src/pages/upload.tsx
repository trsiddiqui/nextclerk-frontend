import {
  Alert,
  Autocomplete,
  Avatar,
  Backdrop,
  Card,
  CardContent,
  Chip,

  // CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Snackbar,
  Switch,
  TextField,
  Typography

  // Tab,
  // Tabs
} from '@mui/material'
import { useState } from 'react'
import { FileUpload, FileUploadProps } from 'src/@core/components/custom/file-upload'
import { AutocompleteRow, getInitials } from 'src/@core/utils'
import { getAllCategories, getAllLabels, searchUsers, uploadFile } from 'src/utils/apiClient'
import { UploadedFileProps, User } from 'src/utils/types'

// import { useRouter } from 'next/router'

enum SnackBarType {
  Success = 'success',
  Error = 'error',
  Info = 'info'
}

export async function getServerSideProps() {
  const categories = await getAllCategories(true)
  const users = await searchUsers(undefined, true)
  const labels = await getAllLabels(true)

  return {
    props: {
      categories,
      users,
      labels
    }
  }
}

const Upload = ({
  categories,
  users,
  labels
}: {
  categories: Array<AutocompleteRow>
  users: User[]
  labels: {
    label: string
    id: string
    key: string
  }[]
}) => {
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [isConfidential, setIsConfidential] = useState(false)
  const [category, setCategory] = useState<{ label: string; uuid: string } | null>(null)
  const [note, setNote] = useState('')
  const [label, setLabel] = useState<{ label: string; uuid: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [snackBarType, setSnackBarType] = useState<SnackBarType>(SnackBarType.Success)
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [attachment, setAttachment] = useState<UploadedFileProps[]>([])

  // const router = useRouter()
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

  const fileUploadProp = (params: {
    setFileMethod: any
    filesCollection?: unknown[]
    handleModalClose?: any
    paramsForSetFileMethod?: unknown
  }): FileUploadProps => ({
    accept: '*/*',
    onChange: async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files !== null && event.target?.files?.length > 0) {
        setLoading(true)
        const resp = await APICallWrapper(
          uploadFile,
          [event.target.files[0]],
          'An error occurred while attempting to upload the file. Please contact support.'
        )
        setLoading(false)
        if (resp != null) {
          params.setFileMethod(
            params.filesCollection ? params.filesCollection.concat(resp) : resp,
            params.paramsForSetFileMethod
          )
          if (params.handleModalClose) {
            params.handleModalClose()
          }
        }
      }
    },
    onDrop: async (event: React.DragEvent<HTMLElement>) => {
      setLoading(true)
      const resp = await APICallWrapper(
        uploadFile,
        [event.dataTransfer.files[0]],
        'An error occurred while attempting to upload the file. Please contact support.'
      )
      setLoading(false)
      if (resp != null) {
        params.setFileMethod(params.filesCollection ? params.filesCollection.concat(resp) : resp)
        if (params.handleModalClose) {
          params.handleModalClose()
        }
      }
    }
  })

  return (
    <Grid container spacing={5}>
      <Grid container>
        <Grid item xl={8} lg={8} md={8} sm={6} sx={{ paddingRight: 2 }}>
          <Card>
            <CardContent>
              <FileUpload
                {...fileUploadProp({
                  setFileMethod: setAttachment
                })}
                height='70vh'
                width='55vw'
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xl={4} lg={4} md={4} sm={6}>
          <Card sx={{ height: '74vh' }}>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12} sx={{ marginTop: 1 }}>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    File Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Name'
                    placeholder='Name'
                    onChange={e => {
                      setName(e.target.value)
                    }}
                    variant='filled'
                    value={name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type='text'
                    label='Number'
                    placeholder='R32938'
                    variant='filled'
                    onChange={e => {
                      setNumber(e.target.value)
                    }}
                    value={number}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id='tags-outlined'
                      options={categories.map(category => ({ label: category.name, uuid: category.uuid }))}
                      value={category}
                      onChange={(event: any, newValue: { label: string; uuid: string } | null) => {
                        setCategory(newValue)
                      }}
                      filterSelectedOptions
                      renderInput={params => (
                        <TextField
                          variant='filled'
                          {...params}
                          label='Support Category'
                          placeholder='Support Category'
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: -2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        defaultChecked={isConfidential}
                        onChange={event => {
                          setIsConfidential(event.currentTarget.checked)
                        }}
                      />
                    }
                    labelPlacement='start'
                    label='Confidential'
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: -2 }}>
                  <Autocomplete
                    multiple
                    id='tags-standard'
                    fullWidth
                    options={users}
                    getOptionLabel={option => `${option.firstName} ${option.lastName}`}
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
                      <TextField
                        {...params}
                        variant='filled'
                        fullWidth
                        label='Participants'
                        placeholder='Participants'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id='tags-outlined'
                      options={labels.map(label => ({ label: label.label, uuid: label.id }))}
                      value={label}
                      onChange={(event: any, newValue: { label: string; uuid: string } | null) => {
                        setLabel(newValue)
                      }}
                      filterSelectedOptions
                      renderInput={params => (
                        <TextField variant='filled' {...params} label='Label' placeholder='Label' />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    multiline
                    type='text'
                    label='Notes'
                    variant='filled'
                    rows={6}
                    onChange={e => {
                      setNote(e.target.value)
                    }}
                    value={note}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {JSON.stringify(attachment)}
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

export default Upload
