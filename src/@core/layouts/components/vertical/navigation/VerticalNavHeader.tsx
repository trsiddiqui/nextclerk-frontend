// ** React Import
import { ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import { useSettings } from 'src/@core/hooks/useSettings'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
  verticalNavMenuBranding?: (props?: any) => ReactNode
}

// ** Styled Components
const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const StyledLink = styled('a')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginTop: 30
})

const VerticalNavHeader = (props: Props) => {
  // ** Props
  const { verticalNavMenuBranding: userVerticalNavMenuBranding } = props

  const { settings } = useSettings()

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: 6 }}>
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (
        <Link href='/' passHref>
          <StyledLink>
            {settings.mode === 'light' ? (
              <img
                src={`${process.env.NODE_ENV === 'production' ? '/nextclerk-frontend' : ''}/images/logos/nextclerk.png`}
                style={{ width: '100%' }}
                alt='Next Clerk'
              />
            ) : (
              <img
                src={`${
                  process.env.NODE_ENV === 'production' ? '/nextclerk-frontend' : ''
                }/images/logos/nextclerk-inverted.png`}
                style={{ width: '100%' }}
                alt='Next Clerk'
              />
            )}
          </StyledLink>
        </Link>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
