import { Card, CardContent, Chip, Grid } from '@mui/material'
import { Session, User } from 'next-auth'
import { useSession } from 'next-auth/react'
import { SessionTokenKeycloak } from 'src/utils/types'

const Company = () => {
  const { data } = useSession()
  const session = data as unknown as Session & { token: SessionTokenKeycloak; user: User }

  return (
    <>
      <Grid container spacing={5}>
        <Card style={{ width: '100%' }}>
          <CardContent>
            <>
              {session ? (
                session.token.groups.map(permission => (
                  <Chip sx={{ mr: 5, mb: 2 }} key={permission} label={permission}></Chip>
                ))
              ) : (
                <></>
              )}
            </>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default Company
