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
import CloseIcon from '@mui/icons-material/Close'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import MessageIcon from '@mui/icons-material/Message'
import DownloadIcon from '@mui/icons-material/Download'
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'

// import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Autocomplete,
  Avatar,
  Box,
  ButtonGroup,
  Chip,
  FormControlLabel,
  FormLabel,
  Modal,
  Switch,
  Tab,
  Tabs,
  Link,
  useTheme,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  InputAdornment,
  Container,
  Paper,
  RadioGroup,
  Radio
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DatePicker } from '@mui/lab'
import TableCustomized from 'src/views/tables/TableCustomized'
import Dialog from '@mui/material/Dialog'
import { getRangeIndexes, MenuSelectEventArgs, SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet'

const modalStyle = {
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,

  margin: '0 auto',
  borderRadius: '5px'
}
const sheetModalStyle = {
  // width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  margin: '0 auto',
  borderRadius: '5px'
}

interface State {
  name: string
  allCategories: { label: string; id: string }[]
  date: Dayjs | null
  tab: number
  commentsSortedBy: string
  commentsTab: number
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
    commentsSortedBy: 'dateAsc',
    commentsTab: 0
  })
  const [chooseMaterFileModalOpen, setChooseMaterFileModalOpen] = React.useState(false)
  const [personnelModalOpen, setPersonnelModalOpen] = React.useState(false)
  const [journalModalOpen, setJournalModalOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [rightDrawerVisible, setRightDrawerVisible] = React.useState(false)
  const [fileUploaded, setFileUploaded] = React.useState(false)
  const [fileOpenedInExcel, setFileOpenedInExcel] = React.useState(false)
  const [spreadsheet, setSpreadsheet] = React.useState<SpreadsheetComponent>()

  const saveMenuOpen = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [attachments] = React.useState([
    {
      name: 'JanuaryReceipts.xlsx'
    },
    {
      name: 'JanuaryReports.pdf'
    }
  ])

  // const handlePersonnelModalOpen = () => setPersonnelModalOpen(true)
  const handlePersonnelModalClose = () => setPersonnelModalOpen(false)
  const handleChooseMaterFileModalOpen = () => setChooseMaterFileModalOpen(true)
  const handleChooseMaterFileModalClose = () => setChooseMaterFileModalOpen(false)

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

  const handleCommentsTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValues({ ...values, commentsTab: newValue })
  }
  function contextMenuBeforeOpen(): void {
    if (spreadsheet) {
      spreadsheet.removeContextMenuItems(['Cut', 'Copy', 'Paste', 'Paste Special', 'Add Comment', 'Add File'], false)
      spreadsheet.addContextMenuItems([{ text: 'Add Comment' }, { text: 'Add File' }], '', false) //To pass the items, Item before / after that the element to be inserted, Set false if the items need to be inserted before the text.

      // Dont need now, hidden through CSS
      // spreadsheet.hideRibbonTabs(['File', 'Insert', 'Formulas', 'Data', 'View'], true)
      // spreadsheet.hideFileMenuItems(['File', 'Insert', 'Formulas', 'Data', 'View'], true)
      setSpreadsheet(spreadsheet)
    }
  }

  function oncreated(): void {
    if (spreadsheet) {
      //   fetch('http://localhost:3000/customerXRefID/supporting-packages/123/lineItems/sheet') // fetch the remote url
      //     .then(response => {
      //       response.blob().then(fileBlob => {
      //         debugger
      //         const file = new File([fileBlob], 'Sample.xlsx') //convert the blob into file
      //         spreadsheet.open({ file: file }) // open the file into Spreadsheet
      //       })
      //     })
    }
  }

  function onCommentClick(range: string) {
    if (spreadsheet) {
      spreadsheet.selectRange(range)
    }
  }

  function contextMenuItemSelect(args: MenuSelectEventArgs) {
    if (spreadsheet) {
      switch (args.item.text) {
        case 'Add Comment':
          // spreadsheet.cellFormat({ backgroundColor: '#453423' }, 'A50')
          // spreadsheet.selectRange(getRangeAddress([1, 2, 3, 4]))
          setRightDrawerVisible(true)
          spreadsheet.selectRange(String(spreadsheet.getActiveSheet().selectedRange))
          spreadsheet.hideFileMenuItems(['File'], true)
          setSpreadsheet(spreadsheet)
          break
        case 'Add File':
          setRightDrawerVisible(true)
          break
      }
    }
  }

  function onHighlightClick() {
    if (spreadsheet) {
      // TODO: write an algo to get all cells between indexes below and highlight all of them with cellFormat
      console.log(getRangeIndexes(spreadsheet.getActiveSheet().selectedRange))
      spreadsheet.cellFormat(
        { backgroundColor: '#FFFF00', color: '#FFFFFF' },
        spreadsheet.getActiveSheet().selectedRange?.split(':')[0]
      )

      // TODO: find a way to unhighlight a cell as well
    }
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
                  Package Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Support Title'
                  placeholder='Title of Support Package'
                  onChange={handleStateChange('name')}
                  variant='filled'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type='number' label='Support Number' placeholder='R32938' variant='filled' />
              </Grid>
              {/* <Grid item xs={12} sm={4}>
                <TextField fullWidth label='Support Period' placeholder='Q1 2022' variant='filled' />
              </Grid> */}
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField variant='filled' fullWidth label='Journal Number' placeholder='Name of Support Package' />
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
              <Grid item xs={12} sm={2}>
                <FormLabel sx={{ marginLeft: 12 }}>Approver</FormLabel>
                <Chip
                  avatar={<Avatar alt='Mike Champ'>MC</Avatar>}
                  label='Mike Champ'
                  variant='outlined'
                  onDelete={() => {
                    alert('delete action')
                  }}
                  sx={{ marginLeft: 3 }}
                />
                {/* <Link component='button' variant='body2' sx={{ marginTop: 4 }} onClick={handlePersonnelModalOpen}>
                  Select
                </Link> */}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField variant='filled' fullWidth label='Participants' placeholder='Search for Participants' />
                {/* <Link component='button' variant='body2' sx={{ marginTop: 4 }} onClick={handlePersonnelModalOpen}>
                  Select
                </Link> */}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField variant='filled' fullWidth label='Labels' placeholder='Assign Labels' />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ marginTop: -3 }}>
                <Chip
                  avatar={<Avatar alt='Remy Sharp'>RS</Avatar>}
                  label='Remy Sharp'
                  variant='outlined'
                  onDelete={() => {
                    alert('delete action')
                  }}
                  sx={{ marginLeft: 3 }}
                />
                <Chip
                  avatar={<Avatar alt='Mike Champ'>MC</Avatar>}
                  label='Mike Champ'
                  variant='outlined'
                  onDelete={() => {
                    alert('delete action')
                  }}
                  sx={{ marginLeft: 3 }}
                />
              </Grid>

              {/* <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  3. Personnel
                </Typography>
              </Grid> */}
            </Grid>
          </CardContent>
          <Grid item xs={12}>
            <Divider sx={{ margin: 0 }} />
          </Grid>
          <CardActions>
            <Button
              id='basic-button'
              aria-controls={saveMenuOpen ? 'basic-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={saveMenuOpen ? 'true' : undefined}
              onClick={handleClick}
              variant='outlined'
              sx={{ marginLeft: 'auto' }}
              endIcon={<ExpandMoreIcon />}
            >
              Save
            </Button>
            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={saveMenuOpen}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button'
              }}
            >
              <MenuItem onClick={handleClose}>Save Draft</MenuItem>
              <MenuItem onClick={handleClose}>Save</MenuItem>
            </Menu>
          </CardActions>
        </form>
      </Card>
      <Card sx={{ width: '100%', marginTop: 3 }}>
        <Paper>
          <AppBar position='static' color='inherit'>
            <Tabs
              value={values.tab}
              onChange={handleTabChange}
              variant='fullWidth'
              aria-label='full width tabs example'
              sx={{ margin: '0 200px' }}
              indicatorColor='primary'
              textColor='secondary'
            >
              <Tab label='Support' />
              <Tab label='Comments' />
              <Tab label='Journal Entry' />
            </Tabs>
          </AppBar>
          <TabPanel value={values.tab} index={0} dir={theme.direction}>
            <Grid container justifyContent='end'>
              <ButtonGroup>
                <Button endIcon={<BorderColorIcon />} onClick={onHighlightClick}>
                  Highlight
                </Button>
                <Button
                  endIcon={<MessageIcon />}
                  onClick={() => {
                    setRightDrawerVisible(!rightDrawerVisible)
                  }}
                >
                  Comments
                </Button>
              </ButtonGroup>
            </Grid>
            {rightDrawerVisible ? (
              <Drawer anchor='right' variant='permanent' sx={{ zIndex: 1300 }}>
                <Toolbar>
                  <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'></Typography>
                  <IconButton
                    edge='start'
                    color='inherit'
                    onClick={() => {
                      setRightDrawerVisible(false)
                    }}
                    aria-label='close'
                  >
                    <CloseIcon />
                  </IconButton>
                </Toolbar>
                <Tabs
                  value={values.commentsTab}
                  onChange={handleCommentsTabChange}
                  variant='fullWidth'
                  aria-label='full width tabs example'
                >
                  <Tab label='Comments' />
                  <Tab label='Action Items' />
                </Tabs>
                <TabPanel value={values.commentsTab} index={0} dir={theme.direction}>
                  <Grid container sx={{ padding: '0 1rem' }}>
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
                  </Grid>
                  <Grid container spacing={2} sx={{ padding: '0 1rem', mt: 4 }}>
                    <Grid item>
                      <Avatar alt='Remy Sharp'>RS</Avatar>
                    </Grid>
                    <Grid
                      justifyContent='left'
                      item
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        onCommentClick('A1:C5')
                      }}
                    >
                      <h4 style={{ margin: 0, textAlign: 'left' }}>Michel Michel</h4>
                      <Typography sx={{ ml: 2, width: '17rem' }} variant='body1' component='div'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean luctus ut est sed faucibus. Duis
                        bibendum ac ex vehicula laoreet. Suspendisse congue vulputate lobortis. Pellentesque at interdum
                        tortor. Quisque arcu quam, malesuada vel mauris et, posuere sagittis ipsum. Aliquam ultricies a
                        ligula nec faucibus. In elit metus, efficitur lobortis nisi quis, molestie porttitor metus.
                        Pellentesque et neque risus. Aliquam vulputate, mauris vitae tincidunt interdum, mauris mi
                        vehicula urna, nec feugiat quam lectus vitae ex.
                      </Typography>
                      <h4 style={{ marginTop: 5, marginBottom: 5, marginLeft: -50, marginRight: 0, textAlign: 'left' }}>
                        12th December, 2022 1:23PM
                      </h4>
                      <Chip
                        label='Attachment1'
                        color='primary'
                        avatar={<Avatar color='secondary'>PDF</Avatar>}
                        onClick={() => alert('Download This')}
                        onDelete={() => alert('Download This')}
                        deleteIcon={<DownloadIcon />}
                        sx={{ marginLeft: -12 }}
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
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={values.commentsTab} index={1} dir={theme.direction}>
                  <Grid container sx={{ padding: '0 1rem' }}>
                    <TextField
                      fullWidth
                      id='outlined-multiline-flexible'
                      label='Action Item'
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
                  </Grid>
                  <Grid container spacing={2} sx={{ padding: '0 1rem', mt: 4 }}>
                    <Card sx={{ maxWidth: 385 }}>
                      <CardContent>
                        <Typography variant='body2' color='text.secondary'>
                          Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across
                          all continents except Antarctica
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size='small'>Mark as Completed</Button>
                        <Button size='small'>Delete</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid container spacing={2} sx={{ padding: '0 1rem', mt: 2 }}>
                    <Card sx={{ maxWidth: 385 }}>
                      <CardContent>
                        <Typography variant='body2' color='text.secondary'>
                          Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across
                          all continents except Antarctica
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size='small'>Mark as Completed</Button>
                        <Button size='small'>Delete</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid container spacing={2} sx={{ padding: '0 1rem', mt: 2 }}>
                    <Card sx={{ maxWidth: 385 }}>
                      <CardContent>
                        <Typography variant='body2' color='text.secondary'>
                          Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across
                          all continents except Antarctica
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size='small'>Mark as Completed</Button>
                        <Button size='small'>Delete</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </TabPanel>
              </Drawer>
            ) : (
              <></>
            )}
            {/* <Card sx={{ height: 400, textAlign: 'center', verticalAlign: 'middle' }}>
            <CardContent> */}
            <FormControlLabel
              control={
                <Switch
                  defaultChecked
                  onChange={() => {
                    setFileUploaded(!fileUploaded)
                  }}
                />
              }
              label='File Uploaded (only for demo)'
            />
            <Button onClick={handleChooseMaterFileModalOpen}>Choose Master File (only for demo)</Button>
            <Button
              onClick={() => {
                setFileOpenedInExcel(true)
              }}
            >
              File opened in Excel (only for demo)
            </Button>
            <Grid container sx={{ pl: 1, height: '800px' }} width='100%'>
              {fileUploaded ? (
                <SpreadsheetComponent
                  allowConditionalFormat
                  // allowEditing={true}
                  enableContextMenu
                  scrollSettings={{ isFinite: false, enableVirtualization: false }}
                  contextMenuBeforeOpen={contextMenuBeforeOpen.bind(this)}
                  contextMenuItemSelect={contextMenuItemSelect.bind(this)}
                  ref={ssObj => {
                    if (ssObj) {
                      setSpreadsheet(ssObj)
                    }
                  }}
                  openUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open'
                  created={oncreated.bind(this)}
                ></SpreadsheetComponent>
              ) : (
                <>
                  <Grid item xs={6} textAlign='right' paddingRight='30px'>
                    <Box>
                      <IconButton
                        size='large'
                        aria-label='Upload'
                        className='card-more-options'
                        sx={{ color: 'blue', fontSize: 100, marginRight: '40px !important' }}
                      >
                        <CloudUploadIcon sx={{ color: 'blue', fontSize: 60 }} />
                      </IconButton>
                      <Typography>Upload File(s) to Start</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} textAlign='left' paddingLeft='30px'>
                    <Box>
                      <IconButton
                        size='large'
                        aria-label='Upload'
                        className='card-more-options'
                        sx={{ color: 'text.secondary', fontSize: 100, marginLeft: '90px', padding: '22px' }}
                        onClick={handleJournalModalOpen}
                      >
                        <Avatar
                          alt='Flora'
                          src={`${
                            process.env.NODE_ENV === 'production' ? '/nextclerk-frontend' : ''
                          }/images/icons/excel.png`}
                        />
                      </IconButton>
                      <Typography>Create a Master Microsoft Excel File</Typography>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </TabPanel>
          <TabPanel value={values.tab} index={1} dir={theme.direction}>
            <Container sx={{ padding: '20px 0px' }}>
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
              <Paper sx={{ margin: '0px -50px' }}>
                <Grid container sx={{ padding: '1rem 1rem' }}>
                  <TextField
                    fullWidth
                    id='outlined-multiline-flexible'
                    label='Add Comment(s)'
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
                </Grid>
              </Paper>
            </Container>
          </TabPanel>
          <TabPanel value={values.tab} index={2} dir={theme.direction}>
            <Grid item xs={12} sm={12}>
              TO DO
            </Grid>
          </TabPanel>
        </Paper>
      </Card>
      <Card sx={{ width: '100%', marginTop: 3, padding: 3 }}>
        <Grid container>
          <Grid item xs={12} sm={8}>
            Supporting Package Attachments: 2
          </Grid>
          <Grid item xs={12} sm={4} alignContent='end' textAlign='right'>
            <Typography variant='body2' sx={{ fontWeight: 600 }}></Typography>
          </Grid>
          <Grid item xs={12} sm={12} sx={{ marginBottom: 3 }}>
            <Divider sx={{ margin: 0 }} />
          </Grid>
          <Grid item xs={12} sm={12}>
            {attachments.map((attachment, index) => (
              <>
                <Link href='#' key={index}>
                  {attachment.name}
                </Link>
                <br />
              </>
            ))}
          </Grid>
        </Grid>
      </Card>
      <Modal open={personnelModalOpen} onClose={handlePersonnelModalClose}>
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
        open={chooseMaterFileModalOpen}
        onClose={handleChooseMaterFileModalClose}
        aria-labelledby='modal-modal-personnel'
        aria-describedby='modal-modal-personnel'
      >
        <Box sx={modalStyle}>
          <Card>
            <CardHeader title='Select a Personnel' sx={{ textAlign: 'center' }}></CardHeader>
            <CardContent>
              <FormLabel id='demo-radio-buttons-group-label'>Choose Master File</FormLabel>
              <RadioGroup
                aria-labelledby='demo-radio-buttons-group-label'
                defaultValue='female'
                name='radio-buttons-group'
              >
                <FormControlLabel value='female' control={<Radio />} label='File 1.xlsx' />
                <FormControlLabel value='male' control={<Radio />} label='Audit.xlsx' />
                <FormControlLabel value='other' control={<Radio />} label='Another.xlsx' />
              </RadioGroup>
            </CardContent>
            <CardActions>
              <Grid container justifyContent='flex-end'>
                <Button size='large' type='submit' variant='contained' onClick={handleChooseMaterFileModalClose}>
                  Save
                </Button>
              </Grid>
            </CardActions>
          </Card>
        </Box>
      </Modal>
      <Dialog
        open={fileOpenedInExcel}
        fullScreen
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none'
          }
        }}
      >
        <Grid container sx={{ pl: 1, padding: 30 }} width='100%'>
          <Grid item xs={12} sm={12} textAlign='center' justifyContent='center'>
            <Box sx={{}}>
              <Button color='primary' variant='contained' onClick={() => setFileOpenedInExcel(false)}>
                Finish Editing Master Sheet
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Dialog>
      <Dialog
        fullScreen
        open={journalModalOpen}
        onClose={handleJournalModalClose}
        aria-labelledby='modal-modal-journal'
        aria-describedby='modal-modal-journal'
        sx={{
          msOverflowX: 'scroll',
          paddingTop: 2
        }}
      >
        <Box sx={sheetModalStyle}></Box>
      </Dialog>
    </Grid>
  )
}

export default CreateSupportPackage
