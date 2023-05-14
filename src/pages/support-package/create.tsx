// ** React Imports
import React, { useState } from 'react'
import { DateTime } from 'luxon'

// ** MUI Imports
import CloseIcon from '@mui/icons-material/Close'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import MessageIcon from '@mui/icons-material/Message'
import DownloadIcon from '@mui/icons-material/Download'
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import LaunchIcon from '@mui/icons-material/Launch'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import SearchIcon from '@mui/icons-material/Search'
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
  Radio,
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
  Dialog,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Checkbox
} from '@mui/material'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DatePicker } from '@mui/lab'
import { StyledTableCell, StyledTableRow } from 'src/views/tables/TableCustomized'
import {
  CellDirective,
  CellsDirective,
  CellStyleModel,
  ColumnDirective,
  ColumnsDirective,
  getRangeIndexes,
  MenuSelectEventArgs,
  RangeDirective,
  RangesDirective,
  RowDirective,
  RowsDirective,
  SheetDirective,
  SheetsDirective,
  SpreadsheetComponent
} from '@syncfusion/ej2-react-spreadsheet'
import { AutoCompleteComponent } from '@syncfusion/ej2-react-dropdowns'
import {
  getAllAccounts,
  getAllCategories,
  getAllCustomers,
  getAllDepartments,
  getAllLocations,
  searchUsers,
  getActiveUser
} from 'src/utils/apiClient'
import { DropDownRow, TabPanel, User, getInitials } from 'src/@core/utils'

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

export async function getServerSideProps() {
  // Fetch data from external API
  const categories = await getAllCategories()
  const accounts = await getAllAccounts()
  const departments = await getAllDepartments()
  const locations = await getAllLocations()
  const customers = await getAllCustomers()
  const activeUser = await getActiveUser()

  // Pass data to the page via props
  return { props: { categories, accounts, departments, locations, customers, activeUser } }
}

const CreateSupportPackage = ({
  categories,
  accounts,
  departments,
  locations,
  customers,
  activeUser
}: {
  categories: Array<DropDownRow>
  accounts: Array<DropDownRow>
  departments: Array<DropDownRow>
  locations: Array<DropDownRow>
  customers: Array<DropDownRow>
  activeUser: { details: { id: string; name: string }; manager: { id: string; name: string } }
}) => {
  debugger
  const theme = useTheme()
  const [name, setName] = useState('')
  const [personnelSearchQuery, setPersonnelSearchQuery] = useState('')
  const [jESpreadsheetRef, setJESpreadsheetRef] = useState<SpreadsheetComponent>()
  const [allCategories] = useState(categories)
  const [date, setDate] = useState<Dayjs | null>(dayjs())
  const [personnel, setPersonnel] = useState<Array<User>>([])
  const [tab, setTab] = useState(0)
  const [multiPersonnelSelection, setMultiPersonnelSelection] = useState<User[]>([])
  const [participants, setParticipants] = useState<User[]>([])
  const [commentsTab, setCommentsTab] = useState(0)
  const [chooseMaterFileModalOpen, setChooseMaterFileModalOpen] = React.useState(false)
  const [personnelModalOpen, setPersonnelModalOpen] = React.useState(false)
  const [multiPersonnelModalOpen, setMultiPersonnelModalOpen] = React.useState(false)
  const [journalModalOpen, setJournalModalOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [rightDrawerVisible, setRightDrawerVisible] = React.useState(false)
  const [fileUploaded, setFileUploaded] = React.useState(false)
  const [fileOpenedInExcel, setFileOpenedInExcel] = React.useState(false)
  const [spreadsheet, setSpreadsheet] = React.useState<SpreadsheetComponent>()
  const [cellPreviousState, setCellPreviousState] = React.useState<{ [cellAddress: string]: CellStyleModel }>({})
  const [currentSPNote, setCurrentSPNote] = useState('')
  const [SPNotes, setSPNotes] = useState<
    Array<{ message: string; files: unknown[]; user: { id: string; name: string }; createdAt: DateTime }>
  >([])

  const autoCompleteAccountComponent = () => {
    return (
      <div className='auto-complete-inside-sheet'>
        <AutoCompleteComponent
          allowCustom={false}
          dataSource={accounts.map(a => a.label)}
          className='abc'
          showPopupButton
        ></AutoCompleteComponent>
      </div>
    )
  }

  const autoCompleteDepartmentComponent = () => {
    return (
      <div className='auto-complete-inside-sheet'>
        <AutoCompleteComponent
          allowCustom={false}
          dataSource={departments.map(a => a.label)}
          className='abc'
          showPopupButton
        ></AutoCompleteComponent>
      </div>
    )
  }

  const autoCompleteLocationsComponent = () => {
    return (
      <div className='auto-complete-inside-sheet'>
        <AutoCompleteComponent
          allowCustom={false}
          dataSource={locations.map(a => a.label)}
          className='abc'
          showPopupButton
        ></AutoCompleteComponent>
      </div>
    )
  }

  const autoCompleteCustomersComponent = () => {
    return (
      <div className='auto-complete-inside-sheet'>
        <AutoCompleteComponent
          allowCustom={false}
          dataSource={customers.map(a => a.label)}
          className='abc'
          showPopupButton
        ></AutoCompleteComponent>
      </div>
    )
  }

  const jESpreadsheetCreated = () => {
    if (!jESpreadsheetRef) {
      return
    }
    jESpreadsheetRef.addDataValidation({ type: 'Decimal', isHighlighted: true, ignoreBlank: true }, 'B2:B1000')
    jESpreadsheetRef.addDataValidation({ type: 'Decimal', isHighlighted: true, ignoreBlank: true }, 'C2:C1000')
  }

  const saveMenuOpen = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [attachments] = React.useState([
    {
      name: 'JanuaryReceipts.xlsx',
      key: 1
    },
    {
      name: 'JanuaryReports.pdf',
      key: 2
    }
  ])

  // const handlePersonnelModalOpen = () => setPersonnelModalOpen(true)
  const handlePersonnelModalClose = () => setPersonnelModalOpen(false)
  const handleMultiPersonnelModalOpen = () => setMultiPersonnelModalOpen(true)
  const handleMultiPersonnelModalClose = () => {
    setMultiPersonnelModalOpen(false)
    setMultiPersonnelSelection([])
  }
  const handleChooseMaterFileModalOpen = () => setChooseMaterFileModalOpen(true)
  const handleChooseMaterFileModalClose = () => setChooseMaterFileModalOpen(false)

  const handleJournalModalOpen = () => setJournalModalOpen(true)
  const handleJournalModalClose = () => setJournalModalOpen(false)

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
      // fetch('http://localhost:3000/customerXRefID/supporting-packages/123/lineItems/sheet') // fetch the remote url
      //   .then(response => {
      //     response.blob().then(fileBlob => {
      //       debugger
      //       const file = new File([fileBlob], 'Sample.xlsx') //convert the blob into file
      //       spreadsheet.open({ file: file }) // open the file into Spreadsheet
      //     })
      //   })
      fetch('/excel5') // fetch the remote url
        .then(response => {
          response.blob().then(fileBlob => {
            const file = new File([fileBlob], 'Sample.xlsx') //convert the blob into file
            spreadsheet.open({ file: file }) // open the file into Spreadsheet
            spreadsheet.hideFileMenuItems(['File'], true)
            spreadsheet.hideToolbarItems('Home', [19])
          })
        })
    }
  }

  function onCommentClick(range: string) {
    if (spreadsheet) {
      const ri = getRangeIndexes(range)
      const cells = getCellsFromRangeAddress(
        ri[0] < ri[2] ? ri[0] : ri[2],
        ri[1] < ri[3] ? ri[1] : ri[3],
        ri[0] > ri[2] ? ri[0] : ri[2],
        ri[1] > ri[3] ? ri[1] : ri[3]
      )

      // const middleCell = cells[Math.floor(cells.length / 2)]
      spreadsheet.goTo(cells[0])
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

  const columnIndexToAddress = (n: number): string => {
    const a = Math.floor(n / 26)

    return a >= 0 ? columnIndexToAddress(a - 1) + String.fromCharCode(65 + (n % 26)) : ''
  }

  const columnAddressToIndex = (index: string): number => {
    const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let i,
      j,
      result = 0

    for (i = 0, j = index.length - 1; i < index.length; i += 1, j -= 1) {
      result += Math.pow(base.length, j) * (base.indexOf(index[i]) + 1)
    }

    return result
  }

  function getCellsFromRangeAddress(a: number, b: number, c: number, d: number): string[] {
    const cells = []
    for (let i = a; i <= c; i++) {
      for (let j = b; j <= d; j++) {
        const colLetters = columnIndexToAddress(j)
        cells.push(colLetters + (i + 1))
      }
    }

    return cells
  }

  function onHighlightClick() {
    if (spreadsheet) {
      if (spreadsheet.getActiveSheet().selectedRange) {
        const ri = getRangeIndexes(String(spreadsheet.getActiveSheet().selectedRange))
        const cells = getCellsFromRangeAddress(
          ri[0] < ri[2] ? ri[0] : ri[2],
          ri[1] < ri[3] ? ri[1] : ri[3],
          ri[0] > ri[2] ? ri[0] : ri[2],
          ri[1] > ri[3] ? ri[1] : ri[3]
        )
        cells.forEach(cell => {
          const columnIndex = columnAddressToIndex(cell.replace(/[^A-Za-z]/g, ''))
          const rowIndex = parseInt(cell.replace(/^\D+/g, ''))
          const existingFormat = spreadsheet.getCellStyleValue(
            ['backgroundColor', 'color'],
            [rowIndex - 1, columnIndex - 1]
          )
          if (cellPreviousState[cell] == null) {
            cellPreviousState[cell] = existingFormat
            setCellPreviousState(cellPreviousState)
          }
          if (existingFormat.backgroundColor === '#FFFF01') {
            spreadsheet.cellFormat(cellPreviousState[cell], cell)
          } else {
            spreadsheet.cellFormat({ backgroundColor: '#FFFF01', color: '#000000' }, cell)
          }
        })
      }

      // TODO: find a way to unhighlight a cell as well
    }
  }

  const [anchorSheetMenuEl, setAnchorSheetMenuEl] = React.useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorSheetMenuEl)
  const handleSheetMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorSheetMenuEl(event.currentTarget)
  }
  const handleSheetMenuClose = () => {
    setAnchorSheetMenuEl(null)
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
                  onChange={e => setName(e.target.value)}
                  variant='filled'
                  value={name}
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
                    options={allCategories}
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
              <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePickerWrapper>
                    <DatePicker
                      label='Support Date'
                      inputFormat='MM/DD/YYYY'
                      value={date}
                      onChange={e => setDate(e)}
                      renderInput={params => <TextField variant='filled' fullWidth {...params} />}
                    />
                  </DatePickerWrapper>
                </LocalizationProvider>
              </Grid>
              <Grid
                item
                xs={12}
                sm={3}
                justifyContent='end'
                sx={{ display: 'flex', alignItems: 'center', textAlign: 'right' }}
              >
                <FormLabel>Approver</FormLabel>
                <Chip
                  label={activeUser.manager.name}
                  avatar={<Avatar>{activeUser.manager.name ? getInitials(activeUser.manager.name) : ''}</Avatar>}
                  variant='outlined'
                  sx={{ marginLeft: 3 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Link component='button' variant='body2' onClick={handleMultiPersonnelModalOpen}>
                  <FormLabel sx={{ cursor: 'pointer', color: 'blue' }}>Participants</FormLabel>
                </Link>
                {participants.length > 0 ? (
                  participants.map((participant, index) => (
                    <Chip
                      key={index}
                      label={participant.name}
                      variant='outlined'
                      onDelete={() => {
                        setParticipants(participants.filter(x => x.id !== participant.id))
                      }}
                      sx={{ marginLeft: 3 }}
                    />
                  ))
                ) : (
                  <></>
                )}
              </Grid>
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  multiple
                  id='tags-filled'
                  options={['']}
                  freeSolo
                  renderTags={(value: readonly string[]) =>
                    value.map((option: string, index: number) => <Chip variant='outlined' label={option} key={index} />)
                  }
                  renderInput={params => (
                    <TextField {...params} variant='filled' label='Labels' placeholder='Assign Labels' />
                  )}
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
            <Menu id='basic-menu' open={saveMenuOpen} onClose={handleClose}>
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
              value={tab}
              onChange={(_e, v) => setTab(v)}
              variant='fullWidth'
              aria-label='full width tabs example'
              sx={{ margin: '0 200px' }}
              indicatorColor='primary'
              textColor='secondary'
            >
              <Tab label='Support' />
              <Tab label='Notes' />
              <Tab label='Journal Entry' />
            </Tabs>
          </AppBar>
          <TabPanel value={tab} index={0} dir={theme.direction}>
            {fileUploaded ? (
              <Grid
                justifyContent='space-between' // Add it here :)
                container
                spacing={24}
              >
                <Grid item>
                  <ButtonGroup>
                    <Button endIcon={<BorderColorIcon />} onClick={onHighlightClick}>
                      Highlight
                    </Button>
                    <Button
                      endIcon={<MessageIcon />}
                      variant={rightDrawerVisible ? 'contained' : 'outlined'}
                      onClick={() => {
                        setRightDrawerVisible(!rightDrawerVisible)
                      }}
                    >
                      Comments
                    </Button>
                  </ButtonGroup>
                </Grid>
                <Grid item>
                  <Button
                    variant='text'
                    endIcon={<LaunchIcon />}
                    onClick={() => {
                      setFileOpenedInExcel(true)
                      window.open(
                        'https://2l2vbz.sharepoint.com/:x:/g/EfT9Nn4Dbr1PsEKQiY8NBSABqvfg9srEaji3uJr1dJsH0A?e=AnOv0i',
                        '_default'
                      )
                    }}
                  >
                    View in Excel Online
                  </Button>
                  <IconButton
                    aria-label='more'
                    id='long-button'
                    aria-controls={menuOpen ? 'long-menu' : undefined}
                    aria-expanded={menuOpen ? 'true' : undefined}
                    aria-haspopup='true'
                    onClick={handleSheetMenuClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id='basic-menu-2'
                    anchorEl={anchorSheetMenuEl}
                    open={menuOpen}
                    onClose={handleSheetMenuClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button'
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setFileUploaded(!fileUploaded)
                        handleSheetMenuClose()
                      }}
                    >
                      Upload File
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleChooseMaterFileModalOpen()
                        handleSheetMenuClose()
                      }}
                    >
                      Select Master File
                    </MenuItem>
                  </Menu>
                </Grid>
              </Grid>
            ) : (
              <></>
            )}

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
                  value={commentsTab}
                  onChange={(_e, v) => setCommentsTab(v)}
                  variant='fullWidth'
                  aria-label='full width tabs example'
                >
                  <Tab label='Comments' />
                  <Tab label='Action Items' />
                </Tabs>
                <TabPanel value={commentsTab} index={0} dir={theme.direction}>
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
                        onCommentClick('A100:C130')
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
                <TabPanel value={commentsTab} index={1} dir={theme.direction}>
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
            <Grid container sx={{ pl: 1, pt: 1, height: fileUploaded ? '600px' : '300px' }} width='100%'>
              {fileUploaded ? (
                <SpreadsheetComponent
                  allowConditionalFormat
                  allowEditing={true}
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
                  <Grid item xs={6} textAlign='right' paddingRight='30px' style={{ marginTop: 80 }}>
                    <Box>
                      <IconButton
                        size='large'
                        aria-label='Upload'
                        className='card-more-options'
                        sx={{ color: 'blue', fontSize: 100, marginRight: '40px !important' }}
                        onClick={() => setFileUploaded(!fileUploaded)}
                      >
                        <CloudUploadIcon sx={{ color: 'blue', fontSize: 60 }} />
                      </IconButton>
                      <Typography>Upload File(s) to Start</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} textAlign='left' paddingLeft='30px' style={{ marginTop: 80 }}>
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
          <TabPanel value={tab} index={1} dir={theme.direction}>
            <Container sx={{ padding: '20px 0px' }}>
              <Paper sx={{ margin: '0px -50px 30px -50px' }}>
                <Grid container sx={{ padding: '1rem 1rem' }}>
                  <TextField
                    fullWidth
                    id='outlined-multiline-flexible'
                    label='Add Comment(s)'
                    multiline
                    variant='standard'
                    value={currentSPNote}
                    onChange={event => setCurrentSPNote(event.target.value)}
                    maxRows={4}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton color='primary'>
                            <AttachFileIcon />
                          </IconButton>

                          <IconButton
                            edge='end'
                            color='primary'
                            onClick={() => {
                              setSPNotes(
                                SPNotes.concat({
                                  message: currentSPNote,
                                  files: [],
                                  user: activeUser.details,
                                  createdAt: DateTime.now()
                                })
                              )
                              setCurrentSPNote('')
                            }}
                          >
                            <SendIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Paper>
              {SPNotes.map((note, index) => (
                <>
                  <Grid container wrap='nowrap' spacing={2} key={index}>
                    <Grid item>
                      <Avatar alt={note.user.name}>{getInitials(note.user.name)}</Avatar>
                    </Grid>
                    <Grid justifyContent='left' item xs zeroMinWidth>
                      <h4 style={{ margin: 0, textAlign: 'left' }}>{note.user.name}</h4>
                      <p style={{ textAlign: 'left' }}>{note.message}</p>
                      <p style={{ textAlign: 'left', color: 'gray' }}>
                        {note.createdAt.toFormat('dd MMM, yyyy hh:mm a')}
                      </p>
                    </Grid>
                  </Grid>
                  <Divider />
                </>
              ))}
            </Container>
          </TabPanel>
          <TabPanel value={tab} index={2} dir={theme.direction}>
            <Grid
              container
              sx={{ pl: 1, height: fileUploaded ? '600px' : '200px' }}
              width='100%'
              className='journal-entry-tab'
            >
              <SpreadsheetComponent
                ref={ssObj => {
                  if (ssObj) {
                    setJESpreadsheetRef(ssObj)
                  }
                }}
                created={jESpreadsheetCreated.bind(this)}
                allowDataValidation
                allowFreezePane
                cellEdit={args => {
                  // Preventing the editing in 5th(Amount) column.
                  if (
                    args.address.endsWith('A1') ||
                    args.address.endsWith('B1') ||
                    args.address.endsWith('C1') ||
                    args.address.endsWith('D1') ||
                    args.address.endsWith('E1') ||
                    args.address.endsWith('F1') ||
                    args.address.endsWith('G1')
                  ) {
                    args.cancel = true
                  }
                }}
              >
                <SheetsDirective>
                  <SheetDirective frozenRows={1} frozenColumns={7}>
                    {/* <RangesDirective>
                                    <RangeDirective dataSource={data}></RangeDirective>
                                </RangesDirective> */}
                    <ColumnsDirective>
                      <ColumnDirective width={200}></ColumnDirective>
                      <ColumnDirective width={80}></ColumnDirective>
                      <ColumnDirective width={80}></ColumnDirective>
                      <ColumnDirective width={280}></ColumnDirective>
                      <ColumnDirective width={150}></ColumnDirective>
                      <ColumnDirective width={150}></ColumnDirective>
                      <ColumnDirective width={150}></ColumnDirective>
                    </ColumnsDirective>
                    <RowsDirective>
                      <RowDirective height={30}>
                        <CellsDirective>
                          <CellDirective
                            value='Account'
                            isLocked
                            style={{
                              color: 'grey',
                              textAlign: 'center',
                              verticalAlign: 'middle',
                              fontSize: '18px',
                              fontFamily: 'Courier New',
                              fontWeight: 'bold'
                            }}
                          ></CellDirective>
                          <CellDirective
                            value='Debit'
                            isLocked
                            style={{
                              color: 'grey',
                              textAlign: 'center',
                              verticalAlign: 'middle',
                              fontSize: '18px',
                              fontFamily: 'Courier New',
                              fontWeight: 'bold'
                            }}
                          ></CellDirective>
                          <CellDirective
                            value='Credit'
                            isLocked
                            style={{
                              color: 'grey',
                              textAlign: 'center',
                              verticalAlign: 'middle',
                              fontSize: '18px',
                              fontFamily: 'Courier New',
                              fontWeight: 'bold'
                            }}
                          ></CellDirective>
                          <CellDirective
                            value='Line Memo'
                            isLocked
                            style={{
                              color: 'grey',
                              textAlign: 'center',
                              verticalAlign: 'middle',
                              fontSize: '18px',
                              fontFamily: 'Courier New',
                              fontWeight: 'bold'
                            }}
                          ></CellDirective>
                          <CellDirective
                            value='Department'
                            isLocked
                            style={{
                              color: 'grey',
                              textAlign: 'center',
                              verticalAlign: 'middle',
                              fontSize: '18px',
                              fontFamily: 'Courier New',
                              fontWeight: 'bold'
                            }}
                          ></CellDirective>
                          <CellDirective
                            value='Location'
                            isLocked
                            style={{
                              color: 'grey',
                              textAlign: 'center',
                              verticalAlign: 'middle',
                              fontSize: '18px',
                              fontFamily: 'Courier New',
                              fontWeight: 'bold'
                            }}
                          ></CellDirective>
                          <CellDirective
                            value='Customer'
                            isLocked
                            style={{
                              color: 'grey',
                              textAlign: 'center',
                              verticalAlign: 'middle',
                              fontSize: '18px',
                              fontFamily: 'Courier New',
                              fontWeight: 'bold'
                            }}
                          ></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                    </RowsDirective>
                    <RangesDirective>
                      <RangeDirective address='A2:A1000' template={autoCompleteAccountComponent} />
                      <RangeDirective address='B2:B1000' showFieldAsHeader />
                      <RangeDirective address='E2:E1000' template={autoCompleteDepartmentComponent} />
                      <RangeDirective address='F2:F1000' template={autoCompleteLocationsComponent} />
                      <RangeDirective address='G2:G1000' template={autoCompleteCustomersComponent} />
                    </RangesDirective>
                  </SheetDirective>
                </SheetsDirective>
              </SpreadsheetComponent>
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
                    setPersonnel([])
                    const users = await searchUsers(personnelSearchQuery)
                    setPersonnel(users)
                  }
                }}
              />
              <IconButton
                type='submit'
                aria-label='search'
                onClick={async () => {
                  setPersonnel([])
                  const users = await searchUsers(personnelSearchQuery)
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
                    <StyledTableRow key={row.name}>
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
                        {row.name}
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
      <Modal open={multiPersonnelModalOpen} onClose={handleMultiPersonnelModalClose}>
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
                    setPersonnel([])
                    const users = await searchUsers(personnelSearchQuery)
                    setPersonnel(users)
                  }
                }}
              />
              <IconButton
                type='submit'
                aria-label='search'
                onClick={async () => {
                  setPersonnel([])
                  const users = await searchUsers(personnelSearchQuery)
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
                    <StyledTableRow key={row.name}>
                      <StyledTableCell component='th' scope='row'>
                        <Checkbox
                          onChange={e => {
                            if (e.target.checked) {
                              const temp = Array.from(new Set(multiPersonnelSelection))
                              temp.push(row)
                              setMultiPersonnelSelection(temp)
                            } else {
                              setMultiPersonnelSelection(multiPersonnelSelection?.filter(x => x.id !== row.id))
                            }
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell component='th' scope='row'>
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell>{row.email}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          <CardActions>
            <Grid container>
              <Button
                size='large'
                type='submit'
                variant='contained'
                onClick={() => {
                  debugger
                  setParticipants(Array.from(new Set(multiPersonnelSelection)))
                  handleMultiPersonnelModalClose()
                }}
              >
                Ok
              </Button>
            </Grid>
            <Grid container justifyContent='flex-end'>
              <Button
                size='large'
                type='submit'
                variant='contained'
                color='warning'
                onClick={handleMultiPersonnelModalClose}
              >
                Close
              </Button>
            </Grid>
          </CardActions>
        </Card>
      </Modal>
      <Modal
        open={chooseMaterFileModalOpen}
        onClose={handleChooseMaterFileModalClose}
        aria-labelledby='modal-modal-personnel'
        aria-describedby='modal-modal-personnel'
      >
        <Box sx={styles.modalStyle}>
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
        <Box sx={styles.sheetModalStyle}></Box>
      </Dialog>
    </Grid>
  )
}

export default CreateSupportPackage
