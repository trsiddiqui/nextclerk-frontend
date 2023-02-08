// ** React Imports
import React, { ChangeEvent, useState } from 'react'
import { ReactGrid, Row, Column, Id, MenuOption, SelectionMode } from '@silevis/reactgrid'
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
  Chip,
  FormControlLabel,
  FormLabel,
  Modal,
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

  const data = {
    creator: 'Unknown',
    lastModifiedBy: 'Taha Rehman',
    created: '2023-01-21T17:54:11.000Z',
    modified: '2023-02-07T03:47:19.000Z',
    properties: { date1904: false },
    worksheets: [
      {
        id: 1,
        name: 'Sheet1',
        dataValidations: {},
        properties: { defaultRowHeight: 15, dyDescent: 0, outlineLevelRow: 0, outlineLevelCol: 0 },
        state: 'visible',
        pageSetup: {
          fitToPage: false,
          margins: { left: 0.7, right: 0.7, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
        },
        headerFooter: null,
        rowBreaks: [],
        views: [
          {
            workbookViewId: 0,
            rightToLeft: false,
            state: 'normal',
            showRuler: true,
            showRowColHeaders: true,
            showGridLines: true,
            zoomScale: 100,
            zoomScaleNormal: 100
          }
        ],
        media: [],
        tables: [],
        conditionalFormattings: [],
        rows: [
          {
            cells: [
              { address: 'A1', value: 'A1 Value', type: 3, style: {} },
              { address: 'B1', value: 'B1 Value', type: 3, style: {} }
            ],
            number: 1,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A2', value: 'A2 Value', type: 3, style: {} },
              { address: 'B2', value: 'B2 Value', type: 3, style: {} }
            ],
            number: 2,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A3', value: 'A1 Value', type: 3, style: {} },
              {
                address: 'B3',
                value: 'B3 Value',
                type: 3,
                comment: {
                  note: {
                    margins: { insetmode: 'auto', inset: [null, 0.13, 0.25, 0.25] },
                    protection: { locked: 'True', lockText: 'True' },
                    editAs: 'absolute',
                    texts: [],
                    anchor: '2, 15, 1, 10, 4, 31, 5, 9'
                  },
                  type: 'note'
                },
                style: {}
              }
            ],
            number: 3,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A4', value: 'A2 Value', type: 3, style: {} },
              {
                address: 'B4',
                value: 'B4 Value',
                type: 3,
                style: {
                  font: { bold: true, size: 11, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor' },
                  border: {},
                  fill: { type: 'pattern', pattern: 'none' }
                }
              }
            ],
            number: 4,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A5', value: 'A1 Value', type: 3, style: {} },
              { address: 'B5', value: 'B1 Value', type: 3, style: {} }
            ],
            number: 5,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              {
                address: 'A6',
                value: 'A2 Value',
                type: 3,
                style: {
                  font: { underline: true, size: 11, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor' },
                  border: {},
                  fill: { type: 'pattern', pattern: 'none' }
                }
              },
              { address: 'B6', value: 'B2 Value', type: 3, style: {} }
            ],
            number: 6,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A7', value: 'A1 Value', type: 3, style: {} },
              { address: 'B7', value: 'B3 Value', type: 3, style: {} }
            ],
            number: 7,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A8', value: 'A2 Value', type: 3, style: {} },
              { address: 'B8', value: 'B4 Value', type: 3, style: {} }
            ],
            number: 8,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              {
                address: 'A9',
                value: 'A1 Value',
                type: 3,
                style: {
                  font: { size: 11, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor' },
                  border: {},
                  fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' }, bgColor: { indexed: 64 } }
                }
              },
              { address: 'B9', value: 'B1 Value', type: 3, style: {} }
            ],
            number: 9,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A10', value: 'A2 Value', type: 3, style: {} },
              { address: 'B10', value: 'B2 Value', type: 3, style: {} }
            ],
            number: 10,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A11', value: 'A1 Value', type: 3, style: {} },
              {
                address: 'B11',
                value: 'B3 Value',
                type: 3,
                style: {
                  font: { size: 11, color: { argb: 'FFFF0000' }, name: 'Calibri', family: 2, scheme: 'minor' },
                  border: {},
                  fill: { type: 'pattern', pattern: 'none' }
                }
              }
            ],
            number: 11,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A12', value: 'A2 Value', type: 3, style: {} },
              { address: 'B12', value: 'B4 Value', type: 3, style: {} }
            ],
            number: 12,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A13', value: 'A1 Value', type: 3, style: {} },
              { address: 'B13', value: 'B1 Value', type: 3, style: {} }
            ],
            number: 13,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A14', value: 'A2 Value', type: 3, style: {} },
              { address: 'B14', value: 'B2 Value', type: 3, style: {} }
            ],
            number: 14,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          }
        ],
        dimensions: { model: { top: 1, left: 1, bottom: 14, right: 2 } },
        merges: []
      }
    ],
    sheets: [
      {
        id: 1,
        name: 'Sheet1',
        dataValidations: {},
        properties: { defaultRowHeight: 15, dyDescent: 0, outlineLevelRow: 0, outlineLevelCol: 0 },
        state: 'visible',
        pageSetup: {
          fitToPage: false,
          margins: { left: 0.7, right: 0.7, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
        },
        headerFooter: null,
        rowBreaks: [],
        views: [
          {
            workbookViewId: 0,
            rightToLeft: false,
            state: 'normal',
            showRuler: true,
            showRowColHeaders: true,
            showGridLines: true,
            zoomScale: 100,
            zoomScaleNormal: 100
          }
        ],
        media: [],
        tables: [],
        conditionalFormattings: [],
        rows: [
          {
            cells: [
              { address: 'A1', value: 'A1 Value', type: 3, style: {} },
              { address: 'B1', value: 'B1 Value', type: 3, style: {} }
            ],
            number: 1,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A2', value: 'A2 Value', type: 3, style: {} },
              { address: 'B2', value: 'B2 Value', type: 3, style: {} }
            ],
            number: 2,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A3', value: 'A1 Value', type: 3, style: {} },
              {
                address: 'B3',
                value: 'B3 Value',
                type: 3,
                comment: {
                  note: {
                    margins: { insetmode: 'auto', inset: [null, 0.13, 0.25, 0.25] },
                    protection: { locked: 'True', lockText: 'True' },
                    editAs: 'absolute',
                    texts: [],
                    anchor: '2, 15, 1, 10, 4, 31, 5, 9'
                  },
                  type: 'note'
                },
                style: {}
              }
            ],
            number: 3,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A4', value: 'A2 Value', type: 3, style: {} },
              {
                address: 'B4',
                value: 'B4 Value',
                type: 3,
                style: {
                  font: { bold: true, size: 11, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor' },
                  border: {},
                  fill: { type: 'pattern', pattern: 'none' }
                }
              }
            ],
            number: 4,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A5', value: 'A1 Value', type: 3, style: {} },
              { address: 'B5', value: 'B1 Value', type: 3, style: {} }
            ],
            number: 5,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              {
                address: 'A6',
                value: 'A2 Value',
                type: 3,
                style: {
                  font: { underline: true, size: 11, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor' },
                  border: {},
                  fill: { type: 'pattern', pattern: 'none' }
                }
              },
              { address: 'B6', value: 'B2 Value', type: 3, style: {} }
            ],
            number: 6,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A7', value: 'A1 Value', type: 3, style: {} },
              { address: 'B7', value: 'B3 Value', type: 3, style: {} }
            ],
            number: 7,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A8', value: 'A2 Value', type: 3, style: {} },
              { address: 'B8', value: 'B4 Value', type: 3, style: {} }
            ],
            number: 8,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              {
                address: 'A9',
                value: 'A1 Value',
                type: 3,
                style: {
                  font: { size: 11, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor' },
                  border: {},
                  fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' }, bgColor: { indexed: 64 } }
                }
              },
              { address: 'B9', value: 'B1 Value', type: 3, style: {} }
            ],
            number: 9,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A10', value: 'A2 Value', type: 3, style: {} },
              { address: 'B10', value: 'B2 Value', type: 3, style: {} }
            ],
            number: 10,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A11', value: 'A1 Value', type: 3, style: {} },
              {
                address: 'B11',
                value: 'B3 Value',
                type: 3,
                style: {
                  font: { size: 11, color: { argb: 'FFFF0000' }, name: 'Calibri', family: 2, scheme: 'minor' },
                  border: {},
                  fill: { type: 'pattern', pattern: 'none' }
                }
              }
            ],
            number: 11,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A12', value: 'A2 Value', type: 3, style: {} },
              { address: 'B12', value: 'B4 Value', type: 3, style: {} }
            ],
            number: 12,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A13', value: 'A1 Value', type: 3, style: {} },
              { address: 'B13', value: 'B1 Value', type: 3, style: {} }
            ],
            number: 13,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          },
          {
            cells: [
              { address: 'A14', value: 'A2 Value', type: 3, style: {} },
              { address: 'B14', value: 'B2 Value', type: 3, style: {} }
            ],
            number: 14,
            min: 1,
            max: 2,
            style: {},
            hidden: false,
            outlineLevel: 0,
            collapsed: false
          }
        ],
        dimensions: { model: { top: 1, left: 1, bottom: 14, right: 2 } },
        merges: []
      }
    ],
    definedNames: [],
    views: [{ x: 240, y: 105, width: 14805, height: 8010, visibility: 'visible' }],
    company: '',
    manager: '',
    title: '',
    subject: '',
    keywords: '',
    category: '',
    description: '',
    revision: 0,
    contentStatus: '',
    themes: { theme1: '\r\n' },
    media: [],
    calcProperties: {}
  }

  // const rows: Row[] = [
  //   {
  //     rowId: 'header',
  //     cells: [
  //       {
  //         type: 'header',
  //         text: 'Name',
  //         nonEditable: true,
  //         style: {
  //           border: {
  //             top: { color: 'red', width: '1px', style: 'solid' },
  //             bottom: { color: 'red', width: '1px', style: 'solid' }
  //           }
  //         }
  //       },
  //       { type: 'header', text: 'Surname', nonEditable: true }
  //     ]
  //   },
  //   {
  //     rowId: '1',
  //     cells: [
  //       { type: 'text', text: 'asd', nonEditable: true },
  //       { type: 'text', text: 'afsafas', nonEditable: true }
  //     ]
  //   },
  //   {
  //     rowId: '2',
  //     cells: [
  //       { type: 'text', text: 'sdg', nonEditable: true },
  //       {
  //         type: 'text',
  //         text: '32523',
  //         nonEditable: true,
  //         style: {
  //           border: {
  //             top: { color: 'green', width: '2px', style: 'dotted' },
  //             bottom: { color: 'green', width: '2px', style: 'dotted' }
  //           }
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     rowId: '3',
  //     cells: [
  //       { type: 'text', text: 'dva4', nonEditable: true },
  //       {
  //         type: 'text',
  //         text: 'sdgshwe',
  //         nonEditable: true,
  //         style: {
  //           border: {
  //             top: { color: 'red', width: '1px', style: 'solid' },
  //             bottom: { color: 'red', width: '1px', style: 'solid' }
  //           }
  //         }
  //       }
  //     ]
  //   }
  // ]

  const gridColumns: Column[] = [{ columnId: '', width: 20 }]
  let gridRows: Row[] = []
  let index = 1
  for (const row of data.worksheets[0].rows) {
    const gridRow: Row = { rowId: row.number, cells: [{ type: 'number', value: index++ }] }
    for (const cell of row.cells) {
      const cellAddress = cell.address.replace(/[0-9]/g, '')
      if (!gridColumns.some(x => x.columnId === cellAddress)) {
        gridColumns.push({
          columnId: cellAddress,
          resizable: true
        })
      }
      gridRow.cells.push({
        type: 'text',
        text: cell.value,
        nonEditable: true
      })
    }
    gridRows.push(gridRow)
  }
  const headerRow: Row = {
    rowId: 0,
    cells: gridColumns.map(column => ({ type: 'text', text: column.columnId.toString() }))
  }
  gridRows = [headerRow, ...gridRows]

  // const columns: Column[] = [
  //   { columnId: 'name', width: 150, resizable: true, reorderable: true },
  //   { columnId: 'surname', width: 150, resizable: true, reorderable: true }
  // ]

  const simpleHandleContextMenu = (
    selectedRowIds: Id[],
    selectedColIds: Id[],
    selectionMode: SelectionMode,
    menuOptions: MenuOption[]
  ): MenuOption[] => {
    return menuOptions.concat(
      {
        id: 'add-comment',
        label: 'Add Comment',
        handler() // selectedRowIds: Id[],
        // selectedColIds: Id[],
        // selectionMode: SelectionMode,
        // selectedRanges: CellLocation[][]
        {
          console.log('add_comment')
        }
      },
      {
        id: 'attach-file',
        label: 'Attach File',
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
              {/* <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  2. Link to a Journal &nbsp;&nbsp;
                  <Link component='button' variant='body2' onClick={handleJournalModalOpen}>
                    Link
                  </Link>
                </Typography>
              </Grid> */}
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

      <Grid item xs={12}></Grid>
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
            <Grid container wrap='nowrap' xs={12} sm={12} md={12}>
              <ReactGrid
                rows={gridRows}
                columns={gridColumns}
                enableRangeSelection
                enableRowSelection
                enableColumnSelection
                onContextMenu={simpleHandleContextMenu}
              />
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
                <FormControl variant='standard' sx={{ m: 1, minWidth: 120, margin: 5 }}>
                  <InputLabel id='demo-simple-select-filled-label'>Sort By</InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={values.commentsSortedBy}
                    onChange={event => {
                      setValues({ ...values, commentsSortedBy: event.target.value })
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
                  <h4 style={{ margin: 0, textAlign: 'left' }}>Michel Michel</h4>
                  <p style={{ textAlign: 'left' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean luctus ut est sed faucibus. Duis
                    bibendum ac ex vehicula laoreet. Suspendisse congue vulputate lobortis. Pellentesque at interdum
                    tortor. Quisque arcu quam, malesuada vel mauris et, posuere sagittis ipsum. Aliquam ultricies a
                    ligula nec faucibus. In elit metus, efficitur lobortis nisi quis, molestie porttitor metus.
                    Pellentesque et neque risus. Aliquam vulputate, mauris vitae tincidunt interdum, mauris mi vehicula
                    urna, nec feugiat quam lectus vitae ex.{' '}
                  </p>
                  <p style={{ textAlign: 'left', color: 'gray' }}>
                    12th December, 2022 1:23PM
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
        <Divider sx={{ margin: 0 }} />
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
