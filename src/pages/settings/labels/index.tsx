import { Backdrop, Button, Card, CardContent, CircularProgress, Grid, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { v4 as uuid } from 'uuid'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowEditStopParams,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridToolbarContainer,
  MuiEvent,
  useGridApiRef
} from '@mui/x-data-grid'
import { useState } from 'react'
import { DashboardLabel, Label } from 'src/utils/types'
import { archiveLabel, getAllLabels, createLabel } from 'src/utils/apiClient'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'

export async function getServerSideProps() {
  // Fetch data from external API
  const labels = await getAllLabels(true)

  // Pass data to the page via props
  return {
    props: {
      labels: labels.map(l => ({
        label: l.label,
        uuid: l.key
      }))
    }
  }
}

const LabelPage = ({ labels }: { labels: Label[] }) => {
  const gridRef = useGridApiRef()
  const [loading, setLoading] = useState(false)
  const [labelData, setLabelData] = useState<Array<DashboardLabel & { isNew?: boolean }>>(
    labels.map(l => ({ ...l, mode: GridRowModes.Edit, id: l.uuid }))
  )

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  // const handleEditClick = (id: GridRowId) => () => {
  //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  // }

  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
    gridRef.current.forceUpdate()
    setTimeout(async () => {
      const updatedData = gridRef.current.getRow(id)
      setLoading(true)
      try {
        if (updatedData.isNew) {
          await createLabel({
            label: updatedData.label,
            uuid: updatedData.id.toString()
          })
          location.reload()
        } else {
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }, 100)
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    })

    const editedRow = labelData.find(row => row.uuid === id)
    if (editedRow!.isNew) {
      setLabelData(labelData.filter(row => row.uuid !== id))
    }
  }
  const columns: GridColDef[] = [
    {
      field: 'label',
      headerName: 'Labels Name',
      type: 'string',
      editable: true,
      align: 'left',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'left'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Archive Label',
      cellClassName: 'data-grid-column',
      width: 120,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={1}
              icon={
                <Tooltip title='Save'>
                  <SaveIcon />
                </Tooltip>
              }
              label='Save'
              sx={{
                color: 'primary.main'
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={2}
              icon={
                <Tooltip title='Cancel'>
                  <CancelIcon />
                </Tooltip>
              }
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />
          ]
        }

        return [
          // <GridActionsCellItem
          //   key={1}
          //   icon={
          //     <Tooltip title='Edit'>
          //       <EditIcon />
          //     </Tooltip>
          //   }
          //   label='Edit'
          //   className='textPrimary'
          //   onClick={handleEditClick(id)}
          //   color='inherit'
          // />,
          <GridActionsCellItem
            key={2}
            icon={
              <Tooltip title='Delete'>
                <DeleteIcon />
              </Tooltip>
            }
            label='Delete'
            onClick={async () => {
              setLabelData(labelData.filter(row => row.uuid !== id))
              setLoading(true)
              await archiveLabel(id as string, true)
              location.reload()
            }}
            color='inherit'
          />
        ]
      }
    }
  ]

  function EditToolbar() {
    const handleClick = () => {
      const id = uuid()
      const newLabel = {
        uuid: id,
        id,
        label: '',
        isNew: true
      }
      setLabelData([...labelData, newLabel])
      setRowModesModel(oldModel => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'firstName' }
      }))
    }

    return (
      <GridToolbarContainer>
        <Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    )
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  return (
    <>
      <Grid container spacing={5}>
        <Card style={{ width: '100%' }}>
          {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={1}>
              <Tab
                label='Company'
                onClick={() => {
                  router.push('/settings/org-chart/company')
                }}
              />
              <Tab label='Users' />
              <Tab
                label='Roles and Permissions'
                onClick={() => {
                  router.push('/settings/org-chart/roles-permissions')
                }}
              />
            </Tabs>
          </Box> */}
          <CardContent>
            <DataGrid
              editMode='row'
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              rows={labelData}
              columns={columns}
              apiRef={gridRef}
              onRowEditStop={(params: GridRowEditStopParams, event: MuiEvent) => {
                event.defaultMuiPrevented = true
              }}
              slots={{
                toolbar: EditToolbar
              }}
            />
          </CardContent>
        </Card>
      </Grid>
      <Backdrop sx={{ color: '#fff', zIndex: 9999999 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default LabelPage
