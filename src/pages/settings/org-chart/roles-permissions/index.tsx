import { Box, Card, CardContent, Grid, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'

const RolesPermissionsPage = () => {
  const router = useRouter()

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
          <CardContent>Roles and Permissions Page (WIP)</CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default RolesPermissionsPage
