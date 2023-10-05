import { TreeItem, TreeView } from '@mui/lab'
import { Avatar, Backdrop, Card, CardContent, CircularProgress, Grid, Paper, Switch, Typography } from '@mui/material'
import { useState } from 'react'
import MonthsStepper from 'src/@core/components/custom/months-stepper'
import {
  AutocompleteRow,
  getMonthFromDate,
  getYearFromDate,
  isSupportedMimeType,
  mimetypeToIconImage
} from 'src/@core/utils'
import { getAllCategories, getEntity, getFiles, updateFileVisibility } from 'src/utils/apiClient'
import { Entity } from 'src/utils/types'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FolderIcon from '@mui/icons-material/Folder'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { DateTime } from 'luxon'
import { File } from '../utils/types'

export async function getServerSideProps() {
  const entity = await getEntity(true)
  const categories = await getAllCategories(true)
  const files = await getFiles([], [], undefined, undefined, true)

  // Pass data to the page via props
  return { props: { entity, categories: categories.sort((a, b) => a.uuid.localeCompare(b.uuid)), files } }
}

const Library = ({
  entity,
  categories,
  files
}: {
  entity: Entity
  categories: Array<AutocompleteRow>
  files: File[]
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(getMonthFromDate(new Date()))
  const selectedMonthStepper = async (index: number) => {
    setSelectedMonth(index)
    alert(
      `The month returned from the component is ${selectedMonth} which is obv wrong hence the filter by date is not working right now`
    )

    // await updateLibrary()
  }
  const [loading, setLoading] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filesState, setFilesState] = useState(
    files.map(f => ({
      ...f,
      id: f.uuid
    }))
  )

  const updateLibrary = async (category?: string) => {
    setLoading(true)
    try {
      const files = await getFiles(
        category ? [category] : [],
        [],

        // The month component is returning incorrect month
        // It should return a month and year instead of an index
        // once that is fix, uncomment the code below and the date filter will work
        undefined, // selectedMonth,
        undefined // parseInt(getYearFromDate(entity.startOfFinancialYear).toString())
      )
      setFilesState(
        files.map(f => ({
          ...f,
          id: f.uuid
        }))
      )
    } finally {
      setLoading(false)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'File Name',
      type: 'string',
      align: 'left',
      cellClassName: 'data-grid-column',
      flex: 0.4,
      headerAlign: 'left',
      renderCell: params => (
        <>
          {isSupportedMimeType(params.row.mimeType) ? (
            <Avatar
              alt='Flora'
              src={`${process.env.NODE_ENV === 'production' ? '' : ''}${mimetypeToIconImage(params.row.mimeType)}`}
              sx={{ ml: 2 }}
            />
          ) : undefined}
          <Typography sx={{ ml: 5 }}>{params.row.name}</Typography>
        </>
      )
    },
    {
      field: 'labelName',
      headerName: 'Label',
      type: 'string',
      align: 'left',
      cellClassName: 'data-grid-column',
      flex: 0.2,
      headerAlign: 'left',
      renderCell: params => <Typography sx={{ ml: 3 }}>{params.row.labelName}</Typography>
    },
    {
      field: 'createdAt',
      headerName: 'Date Uploaded',
      type: 'string',
      align: 'left',
      cellClassName: 'data-grid-column',
      flex: 0.2,
      headerAlign: 'left',
      renderCell: params => (
        <Typography sx={{ ml: 3 }}>
          {DateTime.fromISO(params.row.createdAt).toLocaleString(DateTime.DATETIME_MED)}
        </Typography>
      )
    },
    {
      field: 'isVisible',
      headerName: 'Visible',
      type: 'boolean',
      align: 'left',
      cellClassName: 'data-grid-column',
      flex: 0.1,
      headerAlign: 'left',
      renderCell: params => (
        <Switch
          checked={params.row.isVisible}
          onChange={async (event, updatedValue) => {
            setLoading(true)
            try {
              await updateFileVisibility(params.row.uuid, updatedValue)
              await updateLibrary(selectedCategory ?? undefined)
            } finally {
              setLoading(false)
            }
          }}
        />
      )
    }
  ]

  return (
    <>
      <Grid container spacing={5}>
        <Card style={{ width: '100%' }}>
          <CardContent>
            <Paper sx={{ padding: 3, mb: 5 }} elevation={1}>
              <MonthsStepper
                startStep={getMonthFromDate(entity.startOfFinancialYear)}
                year={getYearFromDate(entity.startOfFinancialYear).toString()}
                selectedMonthStepper={selectedMonthStepper}
              ></MonthsStepper>
            </Paper>
            <Grid container>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{ pr: 2 }}>
                <TreeView
                  aria-label='file system navigator'
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                  expanded={[entity.uuid]}
                  unselectable='on'
                  onNodeSelect={async (_event: React.SyntheticEvent, nodeId: string) => {
                    if (nodeId != 'all') {
                      setSelectedCategory(nodeId)
                      await updateLibrary(nodeId)
                    } else {
                      setSelectedCategory(null)
                      await updateLibrary(undefined)
                    }
                  }}
                >
                  <TreeItem
                    key={'all'}
                    nodeId={'all'}
                    label={'All'}
                    icon={<FolderIcon />}
                    expandIcon={<FolderIcon />}
                    collapseIcon={<FolderIcon />}
                    sx={{ mt: 1 }}
                  />
                  {categories.map(category => (
                    <TreeItem
                      key={category.uuid}
                      nodeId={category.uuid}
                      label={category.name}
                      icon={<FolderIcon />}
                      expandIcon={<FolderIcon />}
                      collapseIcon={<FolderIcon />}
                      sx={{ mt: 1 }}
                    />
                  ))}
                </TreeView>
              </Grid>
              <Grid item xs={12} sm={6} md={9} lg={9} xl={9} sx={{ borderLeft: '1px solid lightgray', pl: 4 }}>
                <DataGrid
                  rows={filesState}
                  columns={columns}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: 'createdAt', sort: 'desc' }]
                    }
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Backdrop sx={{ color: '#fff', zIndex: 100000 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default Library
