// ** Icon imports
// import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'

// import InboxIcon from '@mui/icons-material/Inbox'
// import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
// import CubeOutline from 'mdi-material-ui/CubeOutline'
// import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
// import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
// import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
// import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
// import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
// import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Tasks',
      icon: Table,
      path: '/task'
    },

    // {
    //   icon: CubeOutline,
    //   title: 'Form Layouts',
    //   path: '/form-layouts'
    // },
    {
      icon: FormatListBulletedIcon,
      title: 'Log Sheet',
      path: '/form-layouts'
    }
  ]
}

export default navigation
