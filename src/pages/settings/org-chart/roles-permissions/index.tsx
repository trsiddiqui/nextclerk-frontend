import {
  Box,

  // Button,
  Card,
  CardContent,

  // CardHeader,
  // Checkbox,
  Chip,
  Grid,

  // ListItemText,
  // MenuItem,
  // OutlinedInput,
  Paper,

  // Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs
} from '@mui/material'
import { useRouter } from 'next/router'
import { getAllPermissions, getAllRolesWithPermissions } from 'src/utils/apiClient'
import { useState } from 'react'

// import AddIcon from '@mui/icons-material/Add'

type Role = {
  id: string
  name: string
  description: string
  composite: boolean
  clientRole: boolean
  containerId: string
}

export async function getServerSideProps() {
  const groupsWithRoles = await getAllRolesWithPermissions(true)
  const roles = await getAllPermissions(true)

  // Fetch data from external API
  // Pass data to the page via props
  return {
    props: {
      groupsWithRoles,
      roles
    }
  }
}

const RolesPermissionsPage = ({
  groupsWithRoles,
  roles
}: {
  groupsWithRoles: {
    id: string
    name: string
    path: string
    roles: Role[]
  }[]
  roles: Role[]
}) => {
  const router = useRouter()
  const [groupsWithRolesState] = useState(groupsWithRoles)

  return (
    <>
      <Grid container spacing={5}>
        <Card style={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={2}>
              <Tab
                label='Company'
                onClick={() => {
                  router.push('/settings/org-chart/company')
                }}
              />
              <Tab
                label='Users'
                onClick={() => {
                  router.push('/settings/org-chart/users')
                }}
              />
              <Tab label='Roles and Permissions' />
            </Tabs>
          </Box>

          {/* <CardHeader
            action={
              <Button variant='contained' endIcon={<AddIcon />} color='primary'>
                Create a Role
              </Button>
            }
          /> */}
          <CardContent>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell>Permissions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupsWithRolesState.map(row => (
                    <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component='th' scope='row' width={260}>
                        {row.name}
                      </TableCell>
                      <TableCell>
                        {/* <Select
                          labelId='demo-multiple-checkbox-label'
                          id='demo-multiple-checkbox'
                          multiple
                          value={row.roles.map(x => x.name)}
                          fullWidth
                          onChange={event => {
                            const value = event.target.value
                            debugger
                            row.roles = (value as string[]).map(x =>
                              typeof x === 'string' ? roles.find(y => y.name === x)! : x
                            )
                            setGroupsWithRolesState([...groupsWithRolesState])
                          }}
                          input={<OutlinedInput label='Tag' />}
                          renderValue={selected => {
                            return selected.length > 0
                              ? `${selected[0]}${selected.length > 1 ? ` + ${selected.length - 1} more` : ''}`
                              : 'None'
                          }}
                        >
                          {roles.map(role => (
                            <MenuItem key={role.id} value={role.name}>
                              <Checkbox disabled checked={row.roles.map(x => x.id).includes(role.id)} />
                              <ListItemText primary={role.name} />
                            </MenuItem>
                          ))}
                        </Select> */}
                        {roles
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(role => (
                            <Chip key={role.id} label={role.name} sx={{ ml: 1, mt: 1 }}></Chip>
                          ))}
                      </TableCell>
                      {/*
                       */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default RolesPermissionsPage
