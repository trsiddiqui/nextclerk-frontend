// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import LoginIcon from '@mui/icons-material/Login'

// ** Icons Imports
import Menu from 'mdi-material-ui/Menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
// import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import { Avatar, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { Magnify } from 'mdi-material-ui'
import BusinessIcon from '@mui/icons-material/Business'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Session, User } from 'next-auth/core/types'
import { JWT } from 'next-auth/jwt/types'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const {
    hidden,

    // settings, saveSettings,
    toggleNavVisibility
  } = props

  // ** Hook
  const hiddenSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { data } = useSession()
  const session = data as unknown as Session & { token: JWT; user: User }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'right',
        justifyContent: 'space-between'
      }}
    >
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'right', width: '100%' }}>
        {hidden ? (
          <IconButton
            color='inherit'
            onClick={toggleNavVisibility}
            sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
          >
            <Menu />
          </IconButton>
        ) : null}
        <Grid container spacing={2}>
          <Grid item justifyContent='flex-end' xs={10} sm={10}>
            <TextField
              fullWidth
              size='small'
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Magnify fontSize='small' />
                  </InputAdornment>
                )
              }}
              placeholder='Search'
            />
          </Grid>
          {/* <Button variant='text' onClick={() => alert('Advance')}>
            Advance
          </Button> */}
          <Grid item xs={2} sm={2} display='flex' justifyContent='flex-end'>
            <Avatar>
              <BusinessIcon />
            </Avatar>
            <Typography sx={{ margin: '1px 5px' }} variant='body2'>
              Working Group LLC
            </Typography>
          </Grid>
        </Grid>
      </Box>
      {session ? (
        <>
          <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
            <NotificationDropdown />
            <UserDropdown name={session.token.name as string} email={session.token.email as string} signOut={signOut} />
          </Box>
        </>
      ) : (
        <>
          <IconButton aria-label='delete' onClick={() => signIn('keycloak')}>
            <LoginIcon />
          </IconButton>
        </>
      )}
    </Box>
  )
}

export default AppBarContent
