import { TreeItem, TreeView } from '@mui/lab'
import { Avatar, Card, CardContent, Grid, Paper, Switch, Typography } from '@mui/material'
import { useState } from 'react'
import MonthsStepper from 'src/@core/components/custom/months-stepper'
import {
  AutocompleteRow,
  getMonthFromDate,
  getYearFromDate,
  isSupportedMimeType,
  mimetypeToIconImage
} from 'src/@core/utils'
import { getAllCategories, getEntity } from 'src/utils/apiClient'
import { Entity } from 'src/utils/types'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FolderIcon from '@mui/icons-material/Folder'
import FolderOpen from '@mui/icons-material/FolderOpen'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { DateTime } from 'luxon'

export async function getServerSideProps() {
  const entity = await getEntity(true)
  const categories = await getAllCategories(true)

  // Pass data to the page via props
  return { props: { entity, categories } }
}

const Library = ({ entity, categories }: { entity: Entity; categories: Array<AutocompleteRow> }) => {
  const [selectedMonthStep, setSelectedMonthStep] = useState<number>(getMonthFromDate(new Date()))
  const selectedMonthStepper = (index: number) => {
    setSelectedMonthStep(index)
  }
  console.log(selectedMonthStep)

  const files = [
    {
      id: 1,
      originalname: 'Bank Reconciliation Package',
      mimetype: 'pdf',
      labelName: 'Kick Off 2023',
      createdAt: DateTime.now().toISO(),
      visible: true
    },
    {
      id: 2,
      originalname: 'Bank Reconciliation Package # 2',
      mimetype: 'spreadsheet',
      labelName: '',
      createdAt: DateTime.now().minus({ days: 5 }).toISO(),
      visible: false
    }
  ]

  const columns: GridColDef[] = [
    {
      field: 'originalname',
      headerName: 'File Name',
      type: 'string',
      align: 'left',
      cellClassName: 'data-grid-column',
      flex: 0.4,
      headerAlign: 'left',
      renderCell: params => (
        <>
          {isSupportedMimeType(params.row.mimetype) ? (
            <Avatar
              alt='Flora'
              src={`${process.env.NODE_ENV === 'production' ? '' : ''}${mimetypeToIconImage(params.row.mimetype)}`}
              sx={{ ml: 2 }}
            />
          ) : undefined}
          <Typography sx={{ ml: 5 }}>{params.row.originalname}</Typography>
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
      field: 'visible',
      headerName: 'Visible',
      type: 'boolean',
      align: 'left',
      cellClassName: 'data-grid-column',
      flex: 0.1,
      headerAlign: 'left',
      renderCell: params => <Switch checked={params.row.visible} />
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
                >
                  <TreeItem
                    nodeId={entity.uuid}
                    label={entity.name}
                    expandIcon={<FolderIcon />}
                    collapseIcon={<FolderIcon />}
                  >
                    {categories.map(category => (
                      <TreeItem
                        key={category.uuid}
                        nodeId={category.uuid}
                        label={category.name}
                        icon={<FolderOpen />}
                        expandIcon={<FolderOpen />}
                        collapseIcon={<FolderOpen />}
                        sx={{ mt: 1 }}
                      />
                    ))}
                  </TreeItem>
                </TreeView>
              </Grid>
              <Grid item xs={12} sm={6} md={9} lg={9} xl={9} sx={{ borderLeft: '1px solid lightgray', pl: 4 }}>
                <DataGrid rows={files} columns={columns} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default Library
