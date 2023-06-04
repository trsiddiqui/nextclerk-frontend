/* eslint-disable lines-around-comment */
// ** React Imports
import React, { useState } from 'react'
import { DateTime } from 'luxon'

// ** MUI Imports
import CloseIcon from '@mui/icons-material/Close'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import MessageIcon from '@mui/icons-material/Message'
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
  Checkbox,
  Backdrop,
  CircularProgress
} from '@mui/material'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DatePicker } from '@mui/lab'
import { StyledTableCell, StyledTableRow } from 'src/views/tables/TableCustomized'
import {
  BeforeSaveEventArgs,
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
  SaveCompleteEventArgs,
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
  getActiveUser,
  uploadFile,
  chooseMasterFile,
  createMasterFile,
  getLatestMasterFile,
  uploadUpdatedFile,
  getAllLabels,
  createSupportingPackage
} from 'src/utils/apiClient'
import {
  AutocompleteRow,
  DropDownRow,
  TabPanel,
  columnAddressToIndex,
  getCellsFromRangeAddress,
  getInitials,
  isSupportedMimeType,
  mimetypeToIconImage
} from 'src/@core/utils'
import { MasterFileUploaded, SupportingPackageUserType, UploadedFileProps, User } from 'src/utils/types'
import { FileUpload, FileUploadProps } from 'src/@core/components/custom/file-upload'

enum ActionItemState {
  TODO = 'TODO',
  COMPLETED = 'COMPLETED'
}

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
  const labels = await getAllLabels()
  const users = await searchUsers()
  const activeUser = await getActiveUser()

  // Pass data to the page via props
  return { props: { categories, accounts, departments, locations, customers, activeUser, users, labels } }
}

type SpreadsheetRange = {
  range: string
  sheet: number
}

const CreateSupportPackage = ({
  categories,
  accounts,
  departments,
  locations,
  customers,
  activeUser,
  users,
  labels
}: {
  categories: Array<AutocompleteRow>
  accounts: Array<DropDownRow>
  departments: Array<DropDownRow>
  locations: Array<DropDownRow>
  customers: Array<DropDownRow>
  labels: Array<DropDownRow>
  users: User[]
  activeUser: { details: { id: string; name: string }; manager: { id: string; name: string } }
}) => {
  const theme = useTheme()
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [isConfidential, setIsConfidential] = useState<boolean>(false)
  const [category, setCategory] = useState<{ label: string; uuid: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [personnelSearchQuery, setPersonnelSearchQuery] = useState('')
  const [journalEntrySpreadsheetRef, setJESpreadsheetRef] = useState<SpreadsheetComponent>()
  const [allCategories] = useState(categories)
  const [allLabels] = useState(labels)
  const [label, setLabel] = useState<{ label: string; uuid: string } | null>(null)
  const [date, setDate] = useState<Dayjs | null>(dayjs())
  const [personnel, setPersonnel] = useState<Array<User>>(users)
  const [tab, setTab] = useState(0)
  const [multiPersonnelSelection, setMultiPersonnelSelection] = useState<User[]>([])
  const [participants, setParticipants] = useState<User[]>([])
  const [commentsTab, setCommentsTab] = useState(0)
  const [chooseMaterFileModalOpen, setChooseMaterFileModalOpen] = React.useState(false)
  const [personnelModalOpen, setPersonnelModalOpen] = React.useState(false)
  const [multiPersonnelModalOpen, setMultiPersonnelModalOpen] = React.useState(false)
  const [uploadSPFileOpen, setUploadSPFileOpen] = React.useState(false)
  const handleUploadSPFileOpen = () => setUploadSPFileOpen(true)
  const handleUploadSPFileClose = () => setUploadSPFileOpen(false)
  const [uploadNotesFileOpen, setUploadNotesFileOpen] = React.useState(false)
  const [uploadMasterFileCommentFileOpen, setUploadMasterFileCommentFileOpen] = React.useState(false)
  const [notesFile, setNotesFile] = React.useState<UploadedFileProps | null>(null)
  const [saveAnchorEl, setSaveAnchorEl] = React.useState<null | HTMLElement>(null)
  const [anchorMasterSheetMenuEl, setMasterSheetEntryMenuEl] = React.useState<null | HTMLElement>(null)
  const [rightDrawerVisible, setRightDrawerVisible] = React.useState(false)
  const [fileOpenedInExcel, setFileOpenedInExcel] = React.useState(false)
  const [spreadsheet, setSpreadsheet] = React.useState<SpreadsheetComponent>()
  const [cellPreviousState, setCellPreviousState] = React.useState<{ [cellAddress: string]: CellStyleModel }>({})
  const [currentSPNote, setCurrentSPNote] = useState('')
  const [SPNotes, setSPNotes] = useState<
    Array<{ message: string; file: UploadedFileProps | null; user: { id: string; name: string }; createdAt: DateTime }>
  >([])
  const [currentMasterFileComment, setCurrentMasterFileComment] = useState('')
  const [masterFileCommentFile, setMasterFileCommentFile] = React.useState<UploadedFileProps | null>(null)
  const [masterFileComments, setMasterFileComments] = useState<
    Array<{
      message: string
      file: UploadedFileProps | null
      user: { id: string; name: string }
      createdAt: DateTime
      cellRange: SpreadsheetRange
    }>
  >([])
  const [masterFile, setMasterFile] = React.useState<MasterFileUploaded | null>()
  const [attachments, setAttachments] = React.useState<UploadedFileProps[]>([])
  const [highlightedCells, sethighlightedCells] = React.useState<string[]>([])
  const [masterFileSelectedRange, setMasterFileSelectedRange] = useState<SpreadsheetRange | null>(null)
  const [currentActionItem, setCurrentActionItem] = useState('')
  const [actionItems, setActionItems] = useState<
    Array<{
      message: string
      user: { id: string; name: string }
      createdAt: DateTime
      cellRange: SpreadsheetRange
      state: ActionItemState
    }>
  >([])

  const handleUploadNotesFileOpen = () => setUploadNotesFileOpen(true)
  const handleUploadNotesFileClose = () => setUploadNotesFileOpen(false)

  const handleUploadMasterFileCommentFileOpen = () => setUploadMasterFileCommentFileOpen(true)
  const handleUploadMasterFileCommentFileClose = () => setUploadMasterFileCommentFileOpen(false)

  const handlePersonnelModalClose = () => setPersonnelModalOpen(false)
  const handleMultiPersonnelModalOpen = () => setMultiPersonnelModalOpen(true)
  const handleMultiPersonnelModalClose = () => {
    setMultiPersonnelModalOpen(false)
    setMultiPersonnelSelection([])
  }
  const handleChooseMaterFileModalOpen = () => setChooseMaterFileModalOpen(true)
  const handleChooseMaterFileModalClose = () => {
    setChooseMaterFileModalOpen(false)
  }

  const journalEntrySpreadsheetCreated = () => {
    if (!journalEntrySpreadsheetRef) {
      return
    }
    // journalEntrySpreadsheetRef.addDataValidation(
    //   { type: 'Decimal', isHighlighted: true, ignoreBlank: true },
    //   'B2:B1000'
    // )
    // journalEntrySpreadsheetRef.addDataValidation(
    //   { type: 'Decimal', isHighlighted: true, ignoreBlank: true },
    //   'C2:C1000'
    // )
  }

  const fileUploadProp = (params: {
    setFileMethod: any
    filesCollection?: unknown[]
    handleModalClose: any
  }): FileUploadProps => ({
    accept: '*/*',
    onChange: async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files !== null && event.target?.files?.length > 0) {
        setLoading(true)
        const resp = await uploadFile(event.target.files[0])
        setLoading(false)
        if (resp != null) {
          params.setFileMethod(params.filesCollection ? params.filesCollection.concat(resp) : resp)
          params.handleModalClose()
        }
      }
    },
    onDrop: async (event: React.DragEvent<HTMLElement>) => {
      setLoading(true)
      const resp = await uploadFile(event.dataTransfer.files[0])
      setLoading(false)
      if (resp != null) {
        params.setFileMethod(params.filesCollection ? params.filesCollection.concat(resp) : resp)
        params.handleModalClose()
      }
    }
  })

  // #region Master File / Spreadsheet
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
      //       const file = new File([fileBlob], 'Sample.xlsx') //convert the blob into file
      //       spreadsheet.open({ file: file }) // open the file into Spreadsheet
      //     })
      //   })
      setLoading(true)
      if (masterFile) {
        fetch(masterFile?.downloadUrl) // fetch the remote url
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
  }

  // When you click on a comment inside Master file, it selects takes you to the cells in the master file
  function onMasterSheetCommentClick(range: SpreadsheetRange) {
    if (spreadsheet) {
      const ri = getRangeIndexes(range.range)
      const cells = getCellsFromRangeAddress(
        ri[0] < ri[2] ? ri[0] : ri[2],
        ri[1] < ri[3] ? ri[1] : ri[3],
        ri[0] > ri[2] ? ri[0] : ri[2],
        ri[1] > ri[3] ? ri[1] : ri[3]
      )

      // const middleCell = cells[Math.floor(cells.length / 2)]
      spreadsheet.activeSheetIndex = range.sheet - 1
      spreadsheet.goTo(cells[0])
      spreadsheet.selectRange(range.range)
    }
  }

  // When you right click on a cell, then select an option inside the menu
  function contextMenuItemSelect(args: MenuSelectEventArgs) {
    if (spreadsheet) {
      switch (args.item.text) {
        case 'Add Comment':
          setRightDrawerVisible(true)
          spreadsheet.selectRange(String(spreadsheet.getActiveSheet().selectedRange))
          setMasterFileSelectedRange({
            range: String(spreadsheet.getActiveSheet().selectedRange),
            sheet: spreadsheet.getActiveSheet().id!
          })
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
            // TODO: In edit screen, set `default` format (come up with one)
            spreadsheet.cellFormat(cellPreviousState[cell], cell)
            sethighlightedCells(highlightedCells.filter(c => c != cell))
          } else {
            spreadsheet.cellFormat({ backgroundColor: '#FFFF01', color: '#000000' }, cell)
            highlightedCells.push(cell)
          }
        })
      }
    }
  }
  // #endregion

  // #region Multiple Option Buttons
  const masterSheetMenuOpen = Boolean(anchorMasterSheetMenuEl)
  const handleMasterSheetMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMasterSheetEntryMenuEl(event.currentTarget)
  }
  const handleMasterSheetMenuClose = () => {
    setMasterSheetEntryMenuEl(null)
  }

  const saveMenuOpen = Boolean(saveAnchorEl)
  const handleSaveMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSaveAnchorEl(event.currentTarget)
  }
  const handleSaveSupportingPackage = async (isDraft: boolean) => {
    setSaveAnchorEl(null)
    if (spreadsheet) {
      spreadsheet?.save({
        saveType: 'Xlsx',
        fileName: masterFile?.originalname
      })
    }

    let communications: Array<{
      users: string[]
      text: string
      createdAt: DateTime
      attachments?: string[]
      cellLink?: SpreadsheetRange
      isCellLinkValid?: boolean
      status?: string
    }> = []

    communications = SPNotes.map(note => ({
      attachments: note.file ? [note.file?.uploaded.uuid] : [],
      users: [note.user.id],
      text: note.message,
      createdAt: note.createdAt
    }))

    communications = communications.concat(
      masterFileComments.map(comment => ({
        attachments: comment.file ? [comment.file?.uploaded.uuid] : [],
        users: [comment.user.id],
        text: comment.message,
        createdAt: comment.createdAt,
        cellLink: comment.cellRange,
        isCellLinkValid: true
      }))
    )

    communications = communications.concat(
      actionItems.map(actionItem => ({
        users: [actionItem.user.id],
        text: actionItem.message,
        createdAt: actionItem.createdAt,
        cellLink: actionItem.cellRange,
        status: actionItem.state
      }))
    )

    const supportingPackage = {
      number,
      title: name,
      categoryUUID: category?.uuid,
      labelUUID: label?.uuid,
      isConfidential,
      date,
      isDraft,
      // TODO: Fill this when linked with a Journal Entry
      journalNumber: undefined,
      users: participants.map(user => ({ uuid: user.uuid, type: SupportingPackageUserType.PARTICIPANT })),
      files: attachments.map(file => ({
        uuid: file.uploaded.uuid,
        isMaster: file.uploaded.uuid === masterFile?.uploaded.uuid
      })),
      communications
    }

    await createSupportingPackage(supportingPackage)
  }
  // #endregion

  const autoCompleteAccountComponent = () => {
    return (
      <div className='auto-complete-inside-sheet'>
        <AutoCompleteComponent
          allowCustom={false}
          dataSource={accounts.map(a => a.label)}
          className='abc'
          showPopupButton
          autofill
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
          autofill
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
          autofill
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
          autofill
        ></AutoCompleteComponent>
      </div>
    )
  }

  const selectMasterFile = async (uuid: string) => {
    setLoading(true)
    const masterFileObject = attachments.find(attachment => attachment.uploaded.uuid === uuid)!
    // TODO: Call API to Upload master file to excel
    // Then open the new file with the spreadsheet component
    const resp = await chooseMasterFile(masterFileObject.uploaded.uuid)
    const downloadUrl = resp['@microsoft.graph.downloadUrl']
    const sharingLink = resp['sharingLink']

    setMasterFile({
      ...masterFileObject,
      downloadUrl,
      sharingLink
    })
    // fetch(downloadUrl) // fetch the remote url
    //   .then(response => {
    //     response.blob().then(fileBlob => {
    //       debugger
    //       const file = new File([fileBlob], masterFileObject.originalname) //convert the blob into file
    //       if (spreadsheet) {
    //         spreadsheet.open({ file: file }) // open the file into Spreadsheet
    //         // spreadsheet.hideFileMenuItems(['File'], true)
    //         // spreadsheet.hideToolbarItems('Home', [19])
    //       }
    //     })
    //   })
  }

  return (
    <Grid container spacing={5}>
      <Card>
        <form onSubmit={e => e.preventDefault()}>
          <CardHeader title='Create a Supporting Package' titleTypographyProps={{ variant: 'h6' }}></CardHeader>
          <Divider sx={{ margin: 0 }} />
          <CardContent>
            <Grid item xs={12} sm={12} sx={{ marginTop: -2 }} textAlign='right'>
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
                <TextField
                  fullWidth
                  type='text'
                  label='Support Number'
                  placeholder='R32938'
                  variant='filled'
                  onChange={e => setNumber(e.target.value)}
                  value={number}
                />
              </Grid>
              {/* <Grid item xs={12} sm={4}>
                <TextField fullWidth label='Support Period' placeholder='Q1 2022' variant='filled' />
              </Grid> */}
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField variant='filled' fullWidth label='Journal Number' placeholder='Journal Number (To Do)' />
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
                      label={`${participant.firstName} ${participant.lastName}`}
                      variant='outlined'
                      avatar={
                        <Avatar>
                          {participant.firstName || participant.lastName
                            ? getInitials(`${participant.firstName} ${participant.lastName}`)
                            : ''}
                        </Avatar>
                      }
                      onDelete={() => {
                        setParticipants(participants.filter(x => x.uuid !== participant.uuid))
                      }}
                      sx={{ marginLeft: 3 }}
                    />
                  ))
                ) : (
                  <></>
                )}
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    id='tags-outlined'
                    options={allLabels.map(label => ({ label: label.label, uuid: label.id }))}
                    value={label}
                    onChange={(event: any, newValue: { label: string; uuid: string } | null) => {
                      setLabel(newValue)
                    }}
                    filterSelectedOptions
                    renderInput={params => <TextField variant='filled' {...params} label='Label' placeholder='Label' />}
                  />
                </FormControl>
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
              onClick={handleSaveMenuClick}
              variant='outlined'
              sx={{ marginLeft: 'auto' }}
              endIcon={<ExpandMoreIcon />}
            >
              Save
            </Button>
            <Menu id='basic-menu' anchorEl={saveAnchorEl} open={saveMenuOpen} onClose={handleSaveSupportingPackage}>
              <MenuItem onClick={() => handleSaveSupportingPackage(true)}>Save Draft</MenuItem>
              <MenuItem
                onClick={() => {
                  handleSaveSupportingPackage(false)
                }}
              >
                Save
              </MenuItem>
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
            {masterFile ? (
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
                      window.open(masterFile.sharingLink, '_default')
                    }}
                  >
                    View in Excel Online
                  </Button>
                  <IconButton
                    aria-label='more'
                    id='long-button'
                    aria-controls={masterSheetMenuOpen ? 'long-menu' : undefined}
                    aria-expanded={masterSheetMenuOpen ? 'true' : undefined}
                    aria-haspopup='true'
                    onClick={handleMasterSheetMenuClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id='mastersheet-menu'
                    anchorEl={anchorMasterSheetMenuEl}
                    open={masterSheetMenuOpen}
                    onClose={handleMasterSheetMenuClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button'
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleMasterSheetMenuClose()
                        handleUploadSPFileOpen()
                      }}
                    >
                      Upload File
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleChooseMaterFileModalOpen()
                        handleMasterSheetMenuClose()
                      }}
                    >
                      Choose Master File
                    </MenuItem>
                  </Menu>
                </Grid>
              </Grid>
            ) : (
              <></>
            )}

            {rightDrawerVisible ? (
              <Drawer
                anchor='right'
                variant='permanent'
                sx={{ zIndex: 1300 }}
                PaperProps={{
                  sx: { width: '400px' }
                }}
              >
                <Toolbar>
                  <Tabs
                    value={commentsTab}
                    onChange={(_e, v) => setCommentsTab(v)}
                    variant='fullWidth'
                    aria-label='full width tabs example'
                  >
                    <Tab label='Comments' />
                    <Tab label='Action Items' />
                  </Tabs>
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

                <TabPanel value={commentsTab} index={0} dir={theme.direction}>
                  <Grid container sx={{ padding: '0 1rem' }}>
                    <TextField
                      fullWidth
                      id='outlined-multiline-flexible'
                      label={
                        masterFileSelectedRange
                          ? `Add Comments for ${masterFileSelectedRange.range}`
                          : 'Select a cell/range to Add Comments'
                      }
                      disabled={masterFileSelectedRange == null}
                      multiline
                      variant='standard'
                      value={currentMasterFileComment}
                      onChange={event => setCurrentMasterFileComment(event.target.value)}
                      maxRows={4}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              disabled={masterFileSelectedRange == null}
                              color='primary'
                              onClick={handleUploadMasterFileCommentFileOpen}
                            >
                              <AttachFileIcon />
                            </IconButton>

                            <IconButton
                              edge='end'
                              color='primary'
                              disabled={masterFileSelectedRange == null}
                              onClick={() => {
                                setMasterFileComments(
                                  masterFileComments.concat({
                                    message: currentMasterFileComment,
                                    file: masterFileCommentFile,
                                    user: activeUser.details,
                                    createdAt: DateTime.now(),
                                    cellRange: masterFileSelectedRange!
                                  })
                                )
                                setCurrentMasterFileComment('')
                                setMasterFileCommentFile(null)
                                setMasterFileSelectedRange(null)
                              }}
                            >
                              <SendIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                    {masterFileCommentFile ? (
                      <Chip
                        color='primary'
                        label={`${masterFileCommentFile.originalname} (${(masterFileCommentFile.size / 1024).toFixed(
                          1
                        )} KB)`}
                        variant={
                          masterFile?.originalname === masterFileCommentFile.originalname ? 'filled' : 'outlined'
                        }
                        avatar={
                          isSupportedMimeType(masterFileCommentFile.mimetype) ? (
                            <Avatar
                              alt='Flora'
                              src={`${
                                process.env.NODE_ENV === 'production' ? '/nextclerk-frontend' : ''
                              }${mimetypeToIconImage(masterFileCommentFile.mimetype)}`}
                            />
                          ) : undefined
                        }
                        onDelete={() => {
                          // TODO: CALL API TO DELETE THE ATTACHED FILE
                          setMasterFileCommentFile(null)
                        }}
                        sx={{ marginLeft: 3 }}
                      />
                    ) : (
                      <></>
                    )}
                  </Grid>
                  <Grid container spacing={2} sx={{ padding: '0 1rem', mt: 4 }}>
                    <Grid justifyContent='left' item sx={{ cursor: 'pointer' }}>
                      {masterFileComments
                        .sort((a, b) => b.createdAt.diff(a.createdAt).as('millisecond'))
                        .map((masterFileComment, index) => (
                          <>
                            <Grid
                              container
                              wrap='nowrap'
                              spacing={2}
                              key={index}
                              onClick={() => {
                                onMasterSheetCommentClick(masterFileComment.cellRange)
                              }}
                            >
                              <Grid item>
                                <Avatar alt={masterFileComment.user.name}>
                                  {getInitials(masterFileComment.user.name)}
                                </Avatar>
                              </Grid>
                              <Grid justifyContent='left' item xs zeroMinWidth>
                                <h4 style={{ margin: 0, textAlign: 'left' }}>{masterFileComment.user.name}</h4>
                                <p style={{ textAlign: 'left' }}>{masterFileComment.message}</p>
                                <p style={{ textAlign: 'left', color: 'gray' }}>
                                  {masterFileComment.createdAt.toFormat('dd MMM, yyyy hh:mm a')}
                                  {masterFileComment.file ? (
                                    <Chip
                                      key={index}
                                      color='primary'
                                      label={`${masterFileComment.file.originalname} (${(
                                        masterFileComment.file.size / 1024
                                      ).toFixed(1)} KB)`}
                                      variant={'filled'}
                                      avatar={
                                        isSupportedMimeType(masterFileComment.file.mimetype) ? (
                                          <Avatar
                                            alt='Flora'
                                            src={`${
                                              process.env.NODE_ENV === 'production' ? '/nextclerk-frontend' : ''
                                            }${mimetypeToIconImage(masterFileComment.file.mimetype)}`}
                                          />
                                        ) : undefined
                                      }
                                      sx={{ marginLeft: 3 }}
                                    />
                                  ) : (
                                    <></>
                                  )}
                                </p>
                              </Grid>
                            </Grid>
                            <Divider />
                          </>
                        ))}
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={commentsTab} index={1} dir={theme.direction}>
                  <Grid container sx={{ padding: '0 1rem' }}>
                    <TextField
                      fullWidth
                      id='outlined-multiline-flexible'
                      label={
                        masterFileSelectedRange
                          ? `Add Action Item for ${masterFileSelectedRange.range}`
                          : 'Select a cell/range to Add Action Item'
                      }
                      multiline
                      variant='standard'
                      maxRows={4}
                      disabled={masterFileSelectedRange == null}
                      value={currentActionItem}
                      onChange={event => setCurrentActionItem(event.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              disabled={masterFileSelectedRange == null}
                              edge='end'
                              color='primary'
                              onClick={() => {
                                setActionItems(
                                  actionItems.concat({
                                    message: currentActionItem,
                                    user: activeUser.details,
                                    createdAt: DateTime.now(),
                                    cellRange: masterFileSelectedRange!,
                                    state: ActionItemState.TODO
                                  })
                                )
                                setCurrentActionItem('')
                                setMasterFileSelectedRange(null)
                              }}
                            >
                              <SendIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  {actionItems
                    .sort((a, b) => b.createdAt.diff(a.createdAt).as('millisecond'))
                    .map((actionItem, index) => (
                      <>
                        <Grid container spacing={2} sx={{ padding: '0 1rem', mt: 4 }} key={index}>
                          <Card
                            sx={{
                              minWidth: '100%',
                              backgroundColor: actionItem.state === ActionItemState.COMPLETED ? 'green' : '#ffe595'
                            }}
                          >
                            <CardContent>
                              <Typography variant='body2' color='text.secondary'>
                                {actionItem.message}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button
                                size='small'
                                disabled={actionItem.state === ActionItemState.COMPLETED}
                                onClick={() => {
                                  const thisActionItem = actionItems.find(item => item.message === actionItem.message)
                                  if (!thisActionItem) throw Error('Should not happen')
                                  thisActionItem.state = ActionItemState.COMPLETED
                                  setActionItems([...actionItems])
                                }}
                              >
                                Mark as Completed
                              </Button>
                              <Button
                                size='small'
                                onClick={() => {
                                  const tempActionItems = actionItems.filter(item => item.message != actionItem.message)
                                  setActionItems([...tempActionItems])
                                }}
                              >
                                Delete
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      </>
                    ))}
                </TabPanel>
              </Drawer>
            ) : (
              <></>
            )}
            <Grid container sx={{ pl: 1, pt: 1, height: masterFile ? '600px' : '300px' }} width='100%'>
              {masterFile ? (
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
                  allowOpen={true}
                  openComplete={() => {
                    setLoading(false)
                  }}
                  saveUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'
                  beforeSave={(args: BeforeSaveEventArgs) => {
                    args.needBlobData = true
                    args.fileName = masterFile.originalname
                  }}
                  saveComplete={async (args: SaveCompleteEventArgs) => {
                    const blob = args.blobData
                    const file = new File([blob], masterFile.originalname)
                    // TODO: Need to call a different endpoint to save this file in S3 and Sharepoint
                    await uploadUpdatedFile(file, masterFile.uploaded.uuid)
                  }}
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
                        onClick={handleUploadSPFileOpen}
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
                        onClick={async () => {
                          // TODO: Call API to create a master excel file
                          // Then set the response filename to attachments as well as set as master file
                          setLoading(true)
                          const masterFileUploaded = await createMasterFile()
                          setMasterFile(masterFileUploaded)
                          setAttachments(attachments.concat(masterFileUploaded))
                        }}
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
              <Paper sx={{ margin: '0px 0 30px 0' }}>
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
                          <IconButton color='primary' onClick={handleUploadNotesFileOpen}>
                            <AttachFileIcon />
                          </IconButton>

                          <IconButton
                            edge='end'
                            color='primary'
                            onClick={() => {
                              setSPNotes(
                                SPNotes.concat({
                                  message: currentSPNote,
                                  file: notesFile,
                                  user: activeUser.details,
                                  createdAt: DateTime.now()
                                })
                              )
                              setCurrentSPNote('')
                              setNotesFile(null)
                            }}
                          >
                            <SendIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  {notesFile ? (
                    <Chip
                      color='primary'
                      label={`${notesFile.originalname} (${(notesFile.size / 1024).toFixed(1)} KB)`}
                      variant={masterFile?.originalname === notesFile.originalname ? 'filled' : 'outlined'}
                      avatar={
                        isSupportedMimeType(notesFile.mimetype) ? (
                          <Avatar
                            alt='Flora'
                            src={`${
                              process.env.NODE_ENV === 'production' ? '/nextclerk-frontend' : ''
                            }${mimetypeToIconImage(notesFile.mimetype)}`}
                          />
                        ) : undefined
                      }
                      onDelete={() => {
                        // TODO: CALL API TO DELETE THE ATTACHED FILE
                        setNotesFile(null)
                      }}
                      sx={{ marginLeft: 3 }}
                    />
                  ) : (
                    <></>
                  )}
                </Grid>
              </Paper>
              {SPNotes.sort((a, b) => b.createdAt.diff(a.createdAt).as('millisecond')).map((note, index) => (
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
                        {note.file ? (
                          <Chip
                            key={index}
                            color='primary'
                            label={`${note.file.originalname} (${(note.file.size / 1024).toFixed(1)} KB)`}
                            variant={masterFile?.originalname === note.file.originalname ? 'filled' : 'outlined'}
                            avatar={
                              isSupportedMimeType(note.file.mimetype) ? (
                                <Avatar
                                  alt='Flora'
                                  src={`${
                                    process.env.NODE_ENV === 'production' ? '/nextclerk-frontend' : ''
                                  }${mimetypeToIconImage(note.file.mimetype)}`}
                                />
                              ) : undefined
                            }
                            sx={{ marginLeft: 3 }}
                          />
                        ) : (
                          <></>
                        )}
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
              sx={{ pl: 1, height: masterFile ? '600px' : '200px' }}
              width='100%'
              className='journal-entry-tab'
            >
              <SpreadsheetComponent
                ref={ssObj => {
                  if (ssObj) {
                    setJESpreadsheetRef(ssObj)
                  }
                }}
                created={journalEntrySpreadsheetCreated.bind(this)}
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
            Supporting Package Attachments: {attachments.length}
          </Grid>
          {attachments.length > 0 ? (
            <Grid item xs={12} sm={4} alignContent='end' textAlign='right'>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                <Link onClick={handleChooseMaterFileModalOpen}>Choose Master File</Link>
              </Typography>
            </Grid>
          ) : (
            <></>
          )}
          <Grid item xs={12} sm={12} sx={{ marginBottom: 3 }}>
            <Divider sx={{ margin: 0 }} />
          </Grid>
          <Grid container>
            {attachments.map((attachment, index) => (
              <>
                <Chip
                  key={index}
                  color='primary'
                  label={`${attachment.originalname} (${(attachment.size / 1024).toFixed(1)} KB)`}
                  variant={masterFile?.originalname === attachment.originalname ? 'filled' : 'outlined'}
                  avatar={
                    isSupportedMimeType(attachment.mimetype) ? (
                      <Avatar
                        alt='Flora'
                        src={`${
                          process.env.NODE_ENV === 'production' ? '/nextclerk-frontend' : ''
                        }${mimetypeToIconImage(attachment.mimetype)}`}
                      />
                    ) : undefined
                  }
                  onDelete={() => {
                    // TODO: CALL API TO DELETE THE ATTACHED FILE
                    const updatedAttachments = attachments.filter(x => x.originalname !== attachment.originalname)
                    setAttachments(updatedAttachments)
                    // see if master file has been deleted
                    const masterFileAttachment = updatedAttachments.find(
                      x => x.uploaded.uuid === masterFile?.uploaded.uuid
                    )
                    if (!masterFileAttachment) {
                      setMasterFile(null)
                    }
                  }}
                  sx={{ marginLeft: 3 }}
                />
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
                    setLoading(true)
                    const users = await searchUsers(personnelSearchQuery)
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
                  const users = await searchUsers(personnelSearchQuery)
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
                    setLoading(true)
                    const users = await searchUsers(personnelSearchQuery)
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
                  const users = await searchUsers(personnelSearchQuery)
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
                        <Checkbox
                          onChange={e => {
                            if (e.target.checked) {
                              const temp = Array.from(new Set(multiPersonnelSelection))
                              temp.push(row)
                              setMultiPersonnelSelection(temp)
                            } else {
                              setMultiPersonnelSelection(multiPersonnelSelection?.filter(x => x.uuid !== row.uuid))
                            }
                          }}
                        />
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
            <Grid container>
              <Button
                size='large'
                type='submit'
                variant='contained'
                color='error'
                onClick={handleMultiPersonnelModalClose}
              >
                Cancel
              </Button>
            </Grid>
            <Grid container justifyContent='flex-end'>
              <Button
                size='large'
                type='submit'
                variant='contained'
                onClick={() => {
                  setParticipants(Array.from(new Set(multiPersonnelSelection)))
                  handleMultiPersonnelModalClose()
                }}
              >
                Ok
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
            <CardHeader title='Choose a Master File' sx={{ textAlign: 'center' }}></CardHeader>
            <CardContent>
              <RadioGroup
                aria-labelledby='demo-radio-buttons-group-label'
                name='radio-buttons-group'
                onChange={async event => {
                  await selectMasterFile(event.target.value)
                  handleChooseMaterFileModalClose()
                }}
                defaultValue={masterFile?.uploaded.uuid}
              >
                {attachments.map((attachment, index) => (
                  <FormControlLabel
                    key={index}
                    value={attachment.uploaded.uuid}
                    control={<Radio />}
                    label={attachment.originalname}
                  />
                ))}
              </RadioGroup>
            </CardContent>
            <CardActions>
              <Grid container justifyContent='flex-start'>
                <Button
                  size='large'
                  type='reset'
                  variant='outlined'
                  onClick={() => {
                    setMasterFile(null)
                    handleChooseMaterFileModalClose()
                  }}
                >
                  Clear
                </Button>
              </Grid>
              <Grid container justifyContent='flex-end'>
                <Button size='large' type='submit' variant='outlined' onClick={handleChooseMaterFileModalClose}>
                  Close
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
              <Button
                color='primary'
                variant='contained'
                onClick={async () => {
                  if (masterFile) {
                    setLoading(true)
                    await getLatestMasterFile(masterFile?.uploaded.uuid)
                    const tempMasterFile = masterFile
                    setMasterFile(null)
                    setTimeout(() => {
                      setMasterFile(tempMasterFile)
                    }, 1000)
                  }
                  setFileOpenedInExcel(false)
                }}
              >
                Finish Editing Master Sheet
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Dialog>
      <Dialog
        open={uploadSPFileOpen}
        onClose={handleUploadSPFileClose}
        aria-labelledby='modal-modal-journal'
        aria-describedby='modal-modal-journal'
        sx={{
          msOverflowX: 'scroll',
          paddingTop: 2
        }}
      >
        <Box sx={styles.sheetModalStyle}>
          <FileUpload
            {...fileUploadProp({
              filesCollection: attachments,
              setFileMethod: setAttachments,
              handleModalClose: handleUploadSPFileClose
            })}
          />
        </Box>
      </Dialog>
      <Dialog
        open={uploadNotesFileOpen}
        onClose={handleUploadNotesFileClose}
        aria-labelledby='modal-modal-journal'
        aria-describedby='modal-modal-journal'
        sx={{
          msOverflowX: 'scroll',
          paddingTop: 2
        }}
      >
        <Box sx={styles.sheetModalStyle}>
          <FileUpload
            {...fileUploadProp({ setFileMethod: setNotesFile, handleModalClose: handleUploadNotesFileClose })}
          />
        </Box>
      </Dialog>
      <Dialog
        open={uploadMasterFileCommentFileOpen}
        onClose={handleUploadMasterFileCommentFileClose}
        aria-labelledby='modal-modal-journal'
        aria-describedby='modal-modal-journal'
        sx={{
          msOverflowX: 'scroll',
          paddingTop: 2
        }}
      >
        <Box sx={styles.sheetModalStyle}>
          <FileUpload
            {...fileUploadProp({
              setFileMethod: setMasterFileCommentFile,
              handleModalClose: handleUploadMasterFileCommentFileClose
            })}
          />
        </Box>
      </Dialog>
      <Backdrop sx={{ color: '#fff', zIndex: 9999999 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Grid>
  )
}

export default CreateSupportPackage
