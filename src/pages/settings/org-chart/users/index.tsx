import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Tab,
  Tabs
} from '@mui/material'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowEditStopParams,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  MuiEvent,
  useGridApiRef
} from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { DashboardUser } from 'src/utils/types'
import {
  customerXRefID,
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
  const users = await getAllUsersForDashboard()
  const roles = await getAllRoles()
  const departments = await getAllDepartments()

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
  const [userData, setUserData] = useState<Array<DashboardUser & { isNew?: boolean }>>(
    users.map(u => ({ ...u, mode: GridRowModes.Edit, id: u.uuid }))
  )
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
    setTimeout(async () => {
      const updatedData = gridRef.current.getRow(id)
      await updateUser({
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        uuid: id.toString(),
        isAccountingManager: updatedData.isAccountingManager,
        email: updatedData.email,
        groups: updatedData.groups,
        entityUuid: customerXRefID,
        ...(updatedData.departmentName
          ? { departmentUuid: departments.find(d => d.label === updatedData.departmentName)!.id }
          : {}),
        ...(updatedData.managerName
          ? { managerUuid: userData.find(d => `${d.firstName} ${d.lastName}` === updatedData.managerName)!.uuid }
          : {})
      })
    }, 100)

    //   {
    //     "uuid": "5c4e5fc6-274c-4ac3-8498-75ce6cf7575f",
    //     "email": "Majida@nextclerk.com",
    //     "firstName": "Majida",
    //     "lastName": "Razmjooa",
    //     "isAccountingManager": false,
    //     "archived": false,
    //     "groups": [
    //         "CORE ADMINS",
    //         "Managers"
    //     ],
    //     "departmentName": "IT",
    //     "departmentUuid": null,
    //     "mode": "edit",
    //     "id": "5c4e5fc6-274c-4ac3-8498-75ce6cf7575f",
    //     "managerName": "Majid Razmjoo",
    //     "accontingManager": true,
    //     "status": true
    // }

    // TODO: Call API to update this user here
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setUserData(userData.filter(row => row.uuid !== id))

    // TODO: Call API to delete this user here
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
      field: 'accontingManager',
      headerName: 'Accounting Manager',
      type: 'boolean',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },

    // {
    //   field: 'status',
    //   headerName: 'Enabled',
    //   type: 'boolean',
    //   editable: true,
    //   align: 'center',
    //   cellClassName: 'data-grid-column',
    //   flex: 0.3,
    //   headerAlign: 'center'
    // },
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
            onClick={handleDeleteClick(id)}
            color='inherit'
          />
        ]

        // const actions = [
        //   <GridActionsCellItem
        //     key={1}
        //     icon={
        //       <Tooltip title='View(PDF)/Download(Others)'>
        //         <PreviewIcon />
        //       </Tooltip>
        //     }
        //     label='Attach'
        //     className='textPrimary'
        //     onClick={() => {
        //       // console.log('Some action taken', id, gridRef.current.getRowMode(id))
        //       setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
        //     }}
        //     color='inherit'
        //   />
        // ]

        // return actions
      }
    }
  ]

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
            />
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default UserPage
