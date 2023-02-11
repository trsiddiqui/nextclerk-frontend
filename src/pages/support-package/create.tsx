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
  CheckboxCell
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

// ** Icons Imports
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
  useTheme
} from '@mui/material'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DatePicker } from '@mui/lab'
import TableCollapsible from 'src/views/tables/TableCollapsible'
import TableCustomized from 'src/views/tables/TableCustomized'
import { importedExcelJs } from './sample-excel-file'

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,  -50%)',

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
  const [sheetIndex, setSheetIndex] = React.useState(0)

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

  // const handleJournalModalOpen = () => setJournalModalOpen(true)
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

  const sheets = []
  for (const excelSheet of importedExcelJs) {
    const gridColumns: Column[] = excelSheet.columns.map(col => ({
      columnId: col.address,
      resizable: true,
      width: parseInt(((col.width ?? 20) * 10).toString())

      // width: col.width ? col.width * 2 : undefined
    }))
    gridColumns.unshift({
      columnId: '',
      resizable: false,
      width: 10
    })

    // Cell Types: 	Null = 0, Merge = 1, Number = 2, String = 3, Date = 4, Hyperlink = 5, Formula = 6, SharedString = 7, RichText = 8, Boolean = 9, Error = 10
    let gridRows: Row[] = excelSheet.rows.map((row, index) => ({
      height: row.height,
      rowId: index,
      cells: row.cells.map(cell => {
        const sharedProperties = {
          nonEditable: true,
          style: {
            color: `#${cell.style.font?.color.argb.substring(2)}`,
            background: `#${cell.style.fill?.fgColor.argb.substring(2)}`,
            border: {
              left: {
                color: `#${cell.style.border?.left.color.argb.substring(2)}`,
                style: 'solid', // cell.style.border?.left.style,
                width: '1px'
              },
              top: {
                color: `#${cell.style.border?.top.color.argb.substring(2)}`,
                style: 'solid', // cell.style.border?.top.style,
                width: '1px'
              },
              right: {
                color: `#${cell.style.border?.right.color.argb.substring(2)}`,
                style: 'solid', // cell.style.border?.right.style,
                width: '1px'
              },
              bottom: {
                color: `#${cell.style.border?.bottom.color.argb.substring(2)}`,
                style: 'solid', // cell.style.border?.bottom.style,
                width: '1px'
              }
            },
            overflow: !cell.style.alignment?.wrapText ? 'overflow' : ''
          }
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
              value: Number(cell.value),
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
              text: cell.value.toString(),
              ...sharedProperties
            } as TextCell
        }
      })
    }))

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
          {/* <CardActions>
            <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
              Save
            </Button>
            <Button size='large' color='secondary' variant='outlined'>
              Cancel
            </Button>
          </CardActions> */}
        </form>
      </Card>
      <Card>
        <Box>
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
            <Grid container>
              <Card
                sx={{
                  padding: '10px 10px 0px 10px',
                  border: '1px dotted green',
                  borderRadius: 2
                }}
              >
                <CardActions sx={{ paddingBottom: 0 }}>
                  <ButtonGroup variant='outlined' aria-label='outlined button group'>
                    {sheets.map((sheet, index) => (
                      <Button
                        key={index}
                        sheet-index={index}
                        variant={sheetIndex === index ? 'contained' : undefined}
                        onClick={event => {
                          setSheetIndex(parseInt(event.currentTarget.getAttribute('sheet-index') ?? '0'))
                        }}
                      >
                        {sheet.name}
                      </Button>
                    ))}
                  </ButtonGroup>
                </CardActions>
                <CardContent
                  sx={{
                    overflow: 'scroll',
                    paddingTop: 2
                  }}
                >
                  <ReactGrid
                    rows={sheets[sheetIndex].gridRows}
                    columns={sheets[sheetIndex].gridColumns}
                    enableRowSelection
                    enableColumnSelection
                    onContextMenu={simpleHandleContextMenu}
                  />
                </CardContent>
              </Card>
            </Grid>
          </TabPanel>
          <TabPanel value={values.tab} index={1} dir={theme.direction}>
            {/* <Grid container wrap='nowrap' item xs={12} sm={12} sx={{ padding: '0 3rem' }}>
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
              <Grid container justifyContent='flex-end' xs={12} sm={12}>
                <FormControl variant='standard' sx={{ m: 1,  minWidth: 120,  margin: 5 }}>
                  <InputLabel id='demo-simple-select-filled-label'>Sort By</InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={values.commentsSortedBy}
                    onChange={event => {
                      setValues({ ...values,  commentsSortedBy: event.target.value })
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
                  <h4 style={{ margin: 0,  textAlign: 'left' }}>Michel Michel</h4>
                  <p style={{ textAlign: 'left' }}>
                    Lorem ipsum dolor sit amet,  consectetur adipiscing elit. Aenean luctus ut est sed faucibus. Duis
                    bibendum ac ex vehicula laoreet. Suspendisse congue vulputate lobortis. Pellentesque at interdum
                    tortor. Quisque arcu quam,  malesuada vel mauris et,  posuere sagittis ipsum. Aliquam ultricies a
                    ligula nec faucibus. In elit metus,  efficitur lobortis nisi quis,  molestie porttitor metus.
                    Pellentesque et neque risus. Aliquam vulputate,  mauris vitae tincidunt interdum,  mauris mi vehicula
                    urna,  nec feugiat quam lectus vitae ex.{' '}
                  </p>
                  <p style={{ textAlign: 'left',  color: 'gray' }}>
                    12th December,  2022 1:23PM
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
              <Divider variant='fullWidth' style={{ margin: '30px 0' }} /> */}
            <Grid container wrap='nowrap' spacing={2}>
              <Grid item>
                <Avatar alt='Remy Sharp'>RS</Avatar>
              </Grid>
              <Grid justifyContent='left' item xs zeroMinWidth>
                <h4 style={{ margin: 0, textAlign: 'left' }}>Michel Michel</h4>
                <p style={{ textAlign: 'left' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean luctus ut est sed faucibus. Duis
                  bibendum ac ex vehicula laoreet. Suspendisse congue vulputate lobortis. Pellentesque at interdum
                  tortor. Quisque arcu quam, malesuada vel mauris et, posuere sagittis ipsum. Aliquam ultricies a ligula
                  nec faucibus. In elit metus, efficitur lobortis nisi quis, molestie porttitor metus. Pellentesque et
                  neque risus. Aliquam vulputate, mauris vitae tincidunt interdum, mauris mi vehicula urna, nec feugiat
                  quam lectus vitae ex.{' '}
                </p>
                <p style={{ textAlign: 'left', color: 'gray' }}>12th December, 2022 1:23PM</p>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={values.tab} index={2} dir={theme.direction}>
            <Grid item xs={12} sm={12}>
              TO DO
            </Grid>
          </TabPanel>
        </Box>
        <CardContent>
          <Grid container>
            <Grid item xs={12} sm={8}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Supporting Package Attachments
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} alignContent='end' textAlign='right'>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Total Attachments: 2
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
        </CardContent>
      </Card>
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

export default CreateSupportPackage
