// ** Icon imports
import Table from 'mdi-material-ui/Table'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { FormatIndentIncrease } from 'mdi-material-ui'

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
    },
    {
      icon: FormatIndentIncrease,
      title: 'Integrations',
      path: '/integration'
    },
    {
      icon: LibraryBooksIcon,
      title: 'Library',
      path: '/library'
    }
  ]
}

export default navigation
