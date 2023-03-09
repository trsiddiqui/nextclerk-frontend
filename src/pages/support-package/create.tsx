// ** React Imports
import React, { ChangeEvent, useState } from 'react'
import {
  ReactGrid,
  Row,
  Column,
  Id,
  MenuOption,
  SelectionMode,
  TextCell,
  NumberCell,
  DateCell,
  CheckboxCell,
  CellLocation
} from '@silevis/reactgrid'
import '@silevis/reactgrid/styles.css'

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
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

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
import { importedExcelJs } from 'src/mocked-data/sample-excel-file'
import Dialog from '@mui/material/Dialog'

const modalStyle = {
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
  const [sheetIndex, setSheetIndex] = React.useState(0)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [focussedCell, setFocussedCell] = React.useState(null)
  const [focussedRange, setFocussedRange] = React.useState(null)
  const [rightDrawerVisible, setRightDrawerVisible] = React.useState(false)
  const [fileUploaded, setFileUploaded] = React.useState(false)
  const [fileOpenedInExcel, setFileOpenedInExcel] = React.useState(false)
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

  const [reactGrid, setReactGrid] = useState<ReactGrid | null>(null)

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

  const sheets = []
  for (const excelSheet of importedExcelJs) {
    const gridColumns: Column[] = excelSheet.columns.map((col: { address: any; width: any }, index: any) => ({
      columnId: col.address,
      resizable: true,
      width: parseInt(((col.width ?? 20) * 10).toString()),
      key: index

      // width: col.width ? col.width * 2 : undefined
    }))
    gridColumns.unshift({
      columnId: '',
      resizable: false,
      width: 10
    })

    // Cell Types: 	Null = 0, Merge = 1, Number = 2, String = 3, Date = 4, Hyperlink = 5, Formula = 6, SharedString = 7, RichText = 8, Boolean = 9, Error = 10
    let gridRows: Row[] = excelSheet.rows.map((row: { height: any; cells: any[] }, index: any) => {
      const r = {
        height: row.height,
        rowId: index,
        key: index,
        cells: row.cells.map(
          (
            cell: {
              style: {
                font: { color: { argb: string } }
                fill: { fgColor: { argb: string } }
                border: {
                  left: { color: { argb: string } }
                  top: { color: { argb: string } }
                  right: { color: { argb: string } }
                  bottom: { color: { argb: string } }
                }
                alignment: { wrapText: any }
              }
              address: string
              type: any
              value: any
            },
            index: any
          ) => {
            const sharedProperties = {
              nonEditable: true,
              key: index,
              style: {
                color: `#${cell.style.font?.color?.argb?.substring(2)}`,
                background: `#${cell.style.fill?.fgColor?.argb?.substring(2)}`,
                border: {
                  left: {
                    color: `#${cell.style.border?.left?.color?.argb?.substring(2)}`,
                    style: 'solid', // cell.style.border?.left.style,
                    width: '1px'
                  },
                  top: {
                    color: `#${cell.style.border?.top?.color?.argb?.substring(2)}`,
                    style: 'solid', // cell.style.border?.top.style,
                    width: '1px'
                  },
                  right: {
                    color: `#${cell.style.border?.right?.color?.argb?.substring(2)}`,
                    style: 'solid', // cell.style.border?.right.style,
                    width: '1px'
                  },
                  bottom: {
                    color: `#${cell.style.border?.bottom?.color?.argb?.substring(2)}`,
                    style: 'solid', // cell.style.border?.bottom.style,
                    width: '1px'
                  }
                },
                overflow: !cell.style.alignment?.wrapText ? 'overflow' : ''
              }
            }
            if (cell.address === 'D8' || cell.address === 'D9') {
              const backgroundColor = '#FFEB3B'
              sharedProperties.style.background = backgroundColor
            }
            switch (cell.type) {
              case 2:
                return {
                  type: 'number',
                  value: Number(cell.value),
                  ...sharedProperties
                } as NumberCell
              case 4:
                return {
                  type: 'date',
                  value: cell.value,
                  ...sharedProperties
                } as DateCell
              case 9:
                return {
                  type: 'checkbox',
                  checked: Boolean(cell.value),
                  ...sharedProperties
                } as CheckboxCell
              default:
                return {
                  type: 'text',
                  text: cell.value ?? '',
                  ...sharedProperties
                } as TextCell
            }
          }
        )
      }

      // if (r.cells.length < gridColumns.length) {
      //   r.cells.push(
      //     new Array(gridColumns.length - r.cells.length + 1).map(() => ({
      //       nonEditable: true,
      //       key: index,
      //       style: {
      //         color: `#FFFFFF`,
      //         background: `#00000`,
      //         border: {
      //           left: {
      //             color: `#FFFFFF`,
      //             style: 'solid', // cell.style.border?.left.style,
      //             width: '1px'
      //           },
      //           top: {
      //             color: `#FFFFFF`,
      //             style: 'solid', // cell.style.border?.top.style,
      //             width: '1px'
      //           },
      //           right: {
      //             color: `#FFFFFF`,
      //             style: 'solid', // cell.style.border?.right.style,
      //             width: '1px'
      //           },
      //           bottom: {
      //             color: `#FFFFFF`,
      //             style: 'solid', // cell.style.border?.bottom.style,
      //             width: '1px'
      //           }
      //         }
      //       }
      //     }))
      //   )
      // }

      return r
    })

    let index = 1
    for (const row of gridRows) {
      row.cells.unshift({
        type: 'text',
        text: (index++).toString(),
        style: {
          background: `#D3D3D3`,
          border: {
            right: {
              color: '#880808',
              style: 'solid',
              width: '1px'
            }
          }
        }
      })
    }

    const headerRow: Row = {
      rowId: 0,
      cells: gridColumns.map((column, index) => ({
        type: 'text',
        text: column.columnId.toString(),
        key: index,
        style: {
          background: index > 0 ? `#D3D3D3` : undefined,
          border: {
            right: {
              color: '#880808',
              style: 'dotted',
              width: '1px'
            }
          }
        }
      }))
    }
    gridRows = [headerRow, ...gridRows]
    sheets.push({
      gridColumns,
      gridRows,
      name: excelSheet.name
    })
  }

  const simpleHandleContextMenu = (
    selectedRowIds: Id[],
    selectedColIds: Id[],
    selectionMode: SelectionMode,
    menuOptions: MenuOption[]
  ): MenuOption[] => {
    const filteredMenuOptions = menuOptions.filter(option => option.label === 'Copy')

    return filteredMenuOptions.concat(
      {
        id: 'comments',
        label: 'Comments',
        handler() // selectedRowIds: Id[],
        // selectedColIds: Id[],
        // selectionMode: SelectionMode,
        // selectedRanges: CellLocation[][]
        {
          console.log('add_comment')
        }
      },
      {
        id: 'files',
        label: 'Files',
        handler() // selectedRowIds: Id[],
        // selectedColIds: Id[],
        // selectionMode: SelectionMode,
        // selectedRanges: CellLocation[][]
        {
          console.log('attach_file')
        }
      },
      {
        id: 'highlight',
        label: 'Highlight',
        handler() {
          console.log('highlight')
        }
      },
      {
        id: 'sum',
        label: 'Sum',
        handler(
          _selectedRowIds: Id[],
          _selectedColIds: Id[],
          _selectionMode: SelectionMode,
          selectedRanges: CellLocation[][]
        ) {
          if (
            new Set(selectedRanges[0].map(x => x.columnId)).size === 1 ||
            new Set(selectedRanges[0].map(x => x.rowId)).size === 1
          ) {
            let sum = 0
            selectedRanges[0].forEach(x => {
              const columnId = reactGrid?.props.columns.findIndex(y => y.columnId === x.columnId)
              const cell = reactGrid?.props.rows[parseInt(x.rowId.valueOf() as string) + 1].cells[columnId as number]
              if (cell?.type === 'number' && 'value' in cell) {
                sum += parseFloat(cell.value as string)
              }
            })
            alert(sum)
          }
        }
      }
    )
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
      <Container>
        <Paper>
          <Tabs
            value={values.tab}
            onChange={handleTabChange}
            variant='fullWidth'
            aria-label='full width tabs example'
            sx={{ margin: '10px 200px' }}
          >
            <Tab label='Support' />
            <Tab label='Comments' />
            <Tab label='Journal Entry' />
          </Tabs>
          <TabPanel value={values.tab} index={0} dir={theme.direction}>
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
            <Grid container xs={12} sm={12} sx={{ pl: 1, padding: 30 }} width='100%'>
              {fileUploaded ? (
                <>
                  <Grid item xs={6} sm={6} textAlign='center' justifyContent='center'>
                    <Box sx={{}}>
                      <IconButton
                        size='large'
                        aria-label='Upload'
                        className='card-more-options'
                        sx={{ color: 'text.secondary', fontSize: 100, padding: '22px' }}
                        onClick={handleJournalModalOpen}
                      >
                        <Avatar
                          alt='Flora'
                          src={`${
                            process.env.NODE_ENV === 'production' ? '/nextclerk-frontend' : ''
                          }/images/icons/excel.png`}
                        />
                      </IconButton>
                      <Typography>View Master Sheet</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={6} textAlign='center' justifyContent='center' marginTop={10}>
                    <Box sx={{}}>
                      <Button variant='text' endIcon={<OpenInNewIcon />}>
                        Edit in Microsoft Office Online
                      </Button>
                    </Box>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={6} textAlign='right' paddingRight='30px'>
                    <Box sx={{}}>
                      <IconButton
                        size='large'
                        aria-label='Upload'
                        className='card-more-options'
                        sx={{ color: 'blue', fontSize: 100, marginRight: '30px' }}
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
            {/* </CardContent>
          </Card> */}
            <Grid container>
              {/* <Grid item xs={12} sm={3} sx={{ pl: 1 }}>
                {focussedCell}
                <Grid container wrap='nowrap' spacing={2}>
                  <Grid item>
                    <Avatar alt='Remy Sharp'>RS</Avatar>
                  </Grid>
                  <Grid justifyContent='left' item xs zeroMinWidth>
                    <h4 style={{ margin: 0, textAlign: 'left' }}>Michel Michel&nbsp;12th December, 2022 1:23PM</h4>
                    <p style={{ textAlign: 'left' }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean luctus ut est sed faucibus. Duis
                      bibendum ac ex vehicula laoreet. Suspendisse congue vulputate lobortis. Pellentesque at interdum
                      tortor.
                    </p>
                  </Grid>
                </Grid>
                <Divider />
              </Grid> */}
            </Grid>
          </TabPanel>
          <TabPanel value={values.tab} index={1} dir={theme.direction}>
            <Paper sx={{ padding: 10 }}>
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

              <Grid container sx={{ padding: '0 1rem' }}>
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

                        <IconButton
                          edge='end'
                          color='primary'
                          onClick={() => {
                            console.log(reactGrid?.state.selectedRanges)
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
          </TabPanel>
          <TabPanel value={values.tab} index={2} dir={theme.direction}>
            <Grid item xs={12} sm={12}>
              TO DO
            </Grid>
          </TabPanel>
        </Paper>
      </Container>
      <Grid container marginTop={10}>
        <Grid item xs={12} sm={8}>
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            Supporting Package Attachments
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} alignContent='end' textAlign='right'>
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            Supporting Package Attachments: 2
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
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
      <Dialog open={fileOpenedInExcel} fullScreen sx={{ marginLeft: 30 }}>
        <Grid container xs={12} sm={12} sx={{ pl: 1, padding: 30 }} width='100%'>
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
        <AppBar sx={{ position: 'fixed' }} color='inherit'>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
              Line Items Workbook
            </Typography>
            <IconButton edge='start' color='inherit' onClick={handleJournalModalClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Toolbar sx={{ padding: 2, marginTop: -6, minHeight: 0 }}>
            <div style={{ flex: 1 }}>
              <ButtonGroup variant='outlined' aria-label='outlined button group' sx={{ ml: 3 }}>
                {sheets.map((sheet, index) => (
                  <Button
                    key={index}
                    sheet-index={index}
                    variant={sheetIndex === index ? 'contained' : 'outlined'}
                    color='info'
                    size='small'
                    onClick={event => {
                      setSheetIndex(parseInt(event.currentTarget.getAttribute('sheet-index') ?? '0'))
                    }}
                  >
                    <Typography fontSize={12}>{sheet.name}</Typography>
                  </Button>
                ))}
              </ButtonGroup>
            </div>
            <Grid>
              <ButtonGroup>
                <Button endIcon={<BorderColorIcon />}>Highlight</Button>
                <Button
                  endIcon={<MessageIcon />}
                  onClick={() => {
                    setRightDrawerVisible(!rightDrawerVisible)
                  }}
                >
                  Comment
                </Button>
              </ButtonGroup>
            </Grid>
          </Toolbar>
        </AppBar>
        <Box
          sx={modalStyle}
          onMouseUp={() => {
            setFocussedRange(
              reactGrid?.state.selectedRanges[0].first.column.columnId +
                reactGrid?.state.selectedRanges[0].first.row.idx +
                ' to ' +
                reactGrid?.state.selectedRanges[0].last.column.columnId +
                reactGrid?.state.selectedRanges[0].last.row.idx
            )
          }}
        >
          <hr />
          <ReactGrid
            ref={newRef => {
              // gotcha, this wont trigger on finish selection event
              console.log('updated ref')
              if (newRef) {
                setReactGrid(newRef)
              }
            }}
            rows={sheets[sheetIndex].gridRows}
            columns={sheets[sheetIndex].gridColumns}
            enableRowSelection
            enableColumnSelection
            enableRangeSelection
            stickyTopRows={1}
            stickyLeftColumns={1}
            onContextMenu={simpleHandleContextMenu}
            onFocusLocationChanged={location => {
              if (location.columnId >= 'A' && location.rowId.toString() >= '0')
                setFocussedCell(`${location.columnId}${parseInt(String(location.rowId)) + 1}`)
            }}
          />
          {/* <TableCollapsible /> */}
        </Box>
        {rightDrawerVisible ? (
          <Drawer anchor='right' variant='permanent' sx={{ zIndex: 1300 }}>
            <Toolbar>
              <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
                Focussed Cell: {focussedCell ?? 'None'}
              </Typography>
              <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
                Range: {focussedRange}
              </Typography>
              <IconButton
                edge='start'
                color='inherit'
                onClick={() => setRightDrawerVisible(!rightDrawerVisible)}
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

                        <IconButton
                          edge='end'
                          color='primary'
                          onClick={() => {
                            console.log(reactGrid?.state.selectedRanges)
                          }}
                        >
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
                <Grid justifyContent='left' item xs>
                  <h4 style={{ margin: 0, textAlign: 'left' }}>Michel Michel</h4>
                  <Typography sx={{ ml: 2, width: '17rem' }} variant='body1' component='div'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean luctus ut est sed faucibus. Duis
                    bibendum ac ex vehicula laoreet. Suspendisse congue vulputate lobortis. Pellentesque at interdum
                    tortor. Quisque arcu quam, malesuada vel mauris et, posuere sagittis ipsum. Aliquam ultricies a
                    ligula nec faucibus. In elit metus, efficitur lobortis nisi quis, molestie porttitor metus.
                    Pellentesque et neque risus. Aliquam vulputate, mauris vitae tincidunt interdum, mauris mi vehicula
                    urna, nec feugiat quam lectus vitae ex.
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

                        <IconButton
                          edge='end'
                          color='primary'
                          onClick={() => {
                            console.log(reactGrid?.state.selectedRanges)
                          }}
                        >
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
                      Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all
                      continents except Antarctica
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
                      Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all
                      continents except Antarctica
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
                      Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all
                      continents except Antarctica
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
      </Dialog>
    </Grid>
  )
}

export default CreateSupportPackage
