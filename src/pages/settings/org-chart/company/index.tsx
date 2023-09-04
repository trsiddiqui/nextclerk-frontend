import { Box, Card, CardContent, Grid, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'

const Company = () => {
  const router = useRouter()

  return (
    <>
      <Grid container spacing={5}>
        <Card style={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={0}>
              <Tab label='Company' />
              <Tab
                label='Users'
                onClick={() => {
                  router.push('/settings/org-chart/users')
                }}
              />
              <Tab
                label='Roles and Permissions'
                onClick={() => {
                  router.push('/settings/org-chart/roles-permissions')
                }}
              />
            </Tabs>
          </Box>
          <CardContent>Company Page (WIP)</CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default Company
