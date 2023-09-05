import { Box, Card, CardContent, Grid, Tab, Tabs, Tooltip } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import PreviewIcon from '@mui/icons-material/Preview'
import { useState } from 'react'
import { User } from 'src/utils/types'

const UserPage = () => {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])

  // TODO: remove this log
  console.log(setUsers)

  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      type: 'number',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'middleName',
      headerName: 'Middle Name',
      type: 'number',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      type: 'number',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'email',
      headerName: 'Email Address',
      type: 'number',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'manager',
      headerName: 'Manager',
      type: 'number',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'email',
      headerName: 'Email Address',
      type: 'number',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'manager',
      headerName: 'Manager',
      type: 'number',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'department',
      headerName: 'Department',
      type: 'number',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'subsidiary',
      headerName: 'Subsidiary',
      type: 'number',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'roles',
      headerName: 'Roles',
      type: 'number',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'accontingManager',
      headerName: 'Accounting Manager',
      type: 'number',
      editable: true,
      align: 'center',
      cellClassName: 'data-grid-column',
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'status',
      headerName: 'Status',
      type: 'number',
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
        const actions = [
          <GridActionsCellItem
            key={1}
            icon={
              <Tooltip title='View(PDF)/Download(Others)'>
                <PreviewIcon />
              </Tooltip>
            }
            label='Attach'
            className='textPrimary'
            onClick={() => {
              console.log('Some action taken for id ', id)
            }}
            color='inherit'
          />
        ]

        return actions
      }
    }
  ]

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
              rows={users}
              columns={columns}
              processRowUpdate={(id, data) => {
                console.log('Row updated with ', id, data)
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default UserPage
