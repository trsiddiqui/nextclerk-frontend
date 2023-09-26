import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Tab,
  Tabs
} from '@mui/material'
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
import { useRouter } from 'next/router'
import { useState } from 'react'
import { DashboardUser } from 'src/utils/types'
import {
  createUser,
  customerXRefID,
  deleteUser,
  getAllDepartments,
  getAllRoles,
  getAllUsersForDashboard,
  updateUser
} from 'src/utils/apiClient'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import { DropDownRow } from 'src/@core/utils'

export async function getServerSideProps() {
  // Fetch data from external API
  const users = await getAllUsersForDashboard(true)
  const roles = await getAllRoles(true)
  const departments = await getAllDepartments(true)

  // Pass data to the page via props
  return {
    props: {
      users: users.map(u => ({
        uuid: u.uuid,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        isAccountingManager: u.isAccountingManager,
        archived: u.archived,
        groups: u.groups,
        ...(u.manager && u.manager.firstName
          ? { managerName: `${u.manager.firstName} ${u.manager.lastName}`, managerUuid: u.manager.uuid }
          : {}),
        departmentName: u.department.label,
        departmentUuid: u.department.uuid
      })),
      roles,
      departments
    }
  }
}

const UserPage = ({
  users,
  roles,
  departments
}: {
  users: DashboardUser[]
  roles: string[]
  departments: DropDownRow[]
}) => {
  const router = useRouter()
  const gridRef = useGridApiRef()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<Array<DashboardUser & { isNew?: boolean }>>(
    users.map(u => ({ ...u, mode: GridRowModes.Edit, id: u.uuid }))
  )
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
    gridRef.current.forceUpdate()
    setTimeout(async () => {
      const updatedData = gridRef.current.getRow(id)
      setLoading(true)
      try {
        if (updatedData.isNew) {
          await createUser({
            firstName: updatedData.firstName,
            lastName: updatedData.lastName,
            uuid: updatedData.id.toString(),
            isAccountingManager: updatedData.isAccountingManager,
            email: updatedData.email,
            groups: updatedData.groups,
            entityUuid: customerXRefID,
            ...(updatedData.departmentName
              ? { departmentUuid: departments.find(d => d.label === updatedData.departmentName)!.id }
              : {}),
            ...(updatedData.managerName
              ? {
                  managerUuid: userData.find(d => `${d.firstName} ${d.lastName}` === updatedData.managerName)!.uuid
                }
              : {})
          })
          location.reload()
        } else {
          await updateUser({
            firstName: updatedData.firstName,
            lastName: updatedData.lastName,
            uuid: updatedData.id.toString(),
            isAccountingManager: updatedData.isAccountingManager,
            email: updatedData.email,
            groups: updatedData.groups,
            entityUuid: customerXRefID,
            ...(updatedData.departmentName
              ? { departmentUuid: departments.find(d => d.label === updatedData.departmentName)!.id }
              : {}),
            ...(updatedData.managerName
              ? {
                  managerUuid: userData.find(d => `${d.firstName} ${d.lastName}` === updatedData.managerName)!.uuid
                }
              : {})
          })
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

    const editedRow = userData.find(row => row.uuid === id)
    if (editedRow!.isNew) {
      setUserData(userData.filter(row => row.uuid !== id))
    }
  }
  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      type: 'string',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },

    // {
    //   field: 'middleName',
    //   headerName: 'Middle Name',
    //   type: 'string',
    //   editable: true,
    //   align: 'center',
    //   cellClassName: 'data-grid-column',
    //   flex: 0.3,
    //   headerAlign: 'center'
    // },
    {
      field: 'lastName',
      headerName: 'Last Name',
      type: 'string',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'email',
      headerName: 'Email Address',
      type: 'string',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'managerName',
      headerName: 'Manager',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center',
      type: 'singleSelect',
      valueOptions: users.map(u => `${u.firstName} ${u.lastName}`)
    },
    {
      field: 'departmentName',
      headerName: 'Department',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center',
      type: 'singleSelect',
      valueOptions: departments.map(d => d.label)
    },
    {
      field: 'subsidiary',
      headerName: 'Subsidiary',
      type: 'string',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'groups',
      headerName: 'Roles',
      type: 'string',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center',
      renderCell: params =>
        params.row.groups?.length > 0
          ? `${params.row.groups[0]}${params.row.groups.length > 1 ? ` + ${params.row.groups.length - 1} more` : ''}`
          : 'None',
      renderEditCell: params => {
        return (
          <Select
            labelId='demo-multiple-checkbox-label'
            id='demo-multiple-checkbox'
            multiple
            value={params.row.groups}
            onChange={event => {
              const value = event.target.value
              params.row.groups = value
              gridRef.current.setEditCellValue({
                id: params.id,
                field: 'groups',
                value
              })
              const currentRow = gridRef.current.getRow(params.id)
              currentRow.groups = value
            }}
            input={<OutlinedInput label='Tag' />}
            renderValue={selected => {
              return selected.length > 0
                ? `${selected[0]}${selected.length > 1 ? ` + ${selected.length - 1} more` : ''}`
                : 'None'
            }}
          >
            {roles.map(role => (
              <MenuItem key={role} value={role}>
                <Checkbox checked={params.row.groups.includes(role)} />
                <ListItemText primary={role} />
              </MenuItem>
            ))}
          </Select>
        )
      }
    },
    {
      field: 'isAccountingManager',
      headerName: 'Accounting Manager',
      type: 'boolean',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      cellClassName: 'data-grid-column',
      width: 90,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={1}
              icon={<SaveIcon />}
              label='Save'
              sx={{
                color: 'primary.main'
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={2}
              icon={<CancelIcon />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />
          ]
        }

        return [
          <GridActionsCellItem
            key={1}
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
          />,
          <GridActionsCellItem
            key={2}
            icon={<DeleteIcon />}
            label='Delete'
            onClick={async () => {
              setUserData(userData.filter(row => row.uuid !== id))
              setLoading(true)
              await deleteUser(id as string)
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
      const user = {
        department: {
          label: '',
          uuid: ''
        },
        email: '',
        firstName: '',
        isAccountingManager: false,
        lastName: '',
        uuid: id,
        id,
        archived: false,
        isNew: true,
        groups: []
      }
      setUserData([...userData, user])
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
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
          </Box>
          <CardContent>
            <DataGrid
              editMode='row'
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              rows={userData}
              columns={columns}
              apiRef={gridRef}
              onRowEditStop={(params: GridRowEditStopParams, event: MuiEvent) => {
                event.defaultMuiPrevented = true
              }}
              slots={{
                toolbar: EditToolbar
              }}

              // processRowUpdate={async updatedData => {
              //   setLoading(true)
              //     setRowModesModel({ ...rowModesModel, [updatedData.id]: { mode: GridRowModes.View } })
              //   } catch (error) {
              //     setRowModesModel({ ...rowModesModel, [updatedData.id]: { mode: GridRowModes.Edit } })
              //   } finally {
              //     setLoading(false)
              //   }
              // }}
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

export default UserPage
