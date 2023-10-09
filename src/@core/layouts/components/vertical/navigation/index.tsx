// ** React Import
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Import
import List from '@mui/material/List'
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import { VerticalNavItemsType } from 'src/@core/layouts/types'

// ** Component Imports
import Drawer from './Drawer'
import VerticalNavItems from './VerticalNavItems'
import VerticalNavHeader from './VerticalNavHeader'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import {
  Alert,
  Autocomplete,
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  FormControl,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Typography
} from '@mui/material'
import React from 'react'
import { useSession } from 'next-auth/react'
import { Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { FileUpload, FileUploadProps } from 'src/@core/components/custom/file-upload'
import { getAllCategories, getAllLabels, uploadFile } from 'src/utils/apiClient'
import { AutocompleteRow } from 'src/@core/utils'

// import { useSession } from 'next-auth/react'
// import { Session } from 'next-auth'
// import { JWT } from 'next-auth/jwt'
// import { User } from 'next-auth/core/types'

enum SnackBarType {
  Success = 'success',
  Error = 'error',
  Info = 'info'
}
interface Props {
  hidden: boolean
  navWidth: number
  settings: Settings
  children: ReactNode
  navVisible: boolean
  toggleNavVisibility: () => void
  setNavVisible: (value: boolean) => void
  verticalNavItems?: VerticalNavItemsType
  saveSettings: (values: Settings) => void
  verticalNavMenuContent?: (props?: any) => ReactNode
  afterVerticalNavMenuContent?: (props?: any) => ReactNode
  beforeVerticalNavMenuContent?: (props?: any) => ReactNode
}

const StyledBoxForShadow = styled(Box)<BoxProps>({
  top: 50,
  left: -8,
  zIndex: 2,
  height: 75,
  display: 'none',
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  '&.d-block': {
    display: 'block'
  }
})

const Navigation = (props: Props) => {
  // ** Props
  const {
    hidden,
    afterVerticalNavMenuContent,
    beforeVerticalNavMenuContent,
    verticalNavMenuContent: userVerticalNavMenuContent
  } = props

  const { data } = useSession()
  const session = data as unknown as Session & { token: JWT; user: User }

  useEffect(() => {
    getAllCategories().then(data => {
      setCategories(data as unknown as Array<AutocompleteRow>)
    })
    getAllLabels().then(data => {
      setLabels(data)
    })
  }, [])

  // ** States
  const [groupActive, setGroupActive] = useState<string[]>([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState<string[]>([])
  const [uploadFileOpen, setUploadFileOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [snackBarType, setSnackBarType] = useState<SnackBarType>(SnackBarType.Success)
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [categories, setCategories] = useState<Array<AutocompleteRow>>([])
  const [labels, setLabels] = useState<
    {
      label: string
      id: string
      key: string
    }[]
  >([])
  const [category, setCategory] = useState<{ label: string; uuid: string } | null>(null)
  const [label, setLabel] = useState<{ label: string; uuid: string } | null>(null)

  const handleUploadFileClose = () => setUploadFileOpen(false)

  // const router = useRouter()
  const handleSnackBarClose = () => {
    setSnackBarMessage('')
    setOpenSnackBar(false)
  }

  const showMessage = (message: string, type: SnackBarType) => {
    setSnackBarMessage(message)
    setSnackBarType(type)
    setOpenSnackBar(true)
  }

  const APICallWrapper = async (method: (...args: any[]) => any, args?: any, errorMessage?: string): Promise<any> => {
    try {
      const resp = await method(...args)

      return resp
    } catch (err) {
      console.error(err)
      setLoading(false)
      setUploadFileOpen(true)
      showMessage(errorMessage ?? 'An error occurred', SnackBarType.Error)
    }
  }

  const fileUploadProp = (): FileUploadProps => ({
    accept: '*/*',
    onChange: async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files !== null && event.target?.files?.length > 0) {
        setLoading(true)
        setUploadFileOpen(false)
        console.log(label, category)
        await APICallWrapper(
          uploadFile,
          [event.target.files[0], false, category?.uuid, label?.uuid],
          'An error occurred while attempting to upload the file. Please contact support.'
        )
        showMessage('Your document has been uploaded successfully', SnackBarType.Success)
        setLoading(false)
        setLabel(null)
        setCategory(null)
      }
    },
    onDrop: async (event: React.DragEvent<HTMLElement>) => {
      setLoading(true)
      setUploadFileOpen(false)
      await APICallWrapper(
        uploadFile,
        [event.dataTransfer.files[0], false, category?.uuid, label?.uuid],
        'An error occurred while attempting to upload the file. Please contact support.'
      )
      showMessage('Your document has been uploaded successfully', SnackBarType.Success)
      setLoading(false)
      setLabel(null)
      setCategory(null)
    }
  })

  // ** Ref
  const shadowRef = useRef(null)

  // ** Hooks
  const theme = useTheme()

  // ** Fixes Navigation InfiniteScroll
  const handleInfiniteScroll = (ref: HTMLElement) => {
    if (ref) {
      // @ts-ignore
      ref._getBoundingClientRect = ref.getBoundingClientRect

      ref.getBoundingClientRect = () => {
        // @ts-ignore
        const original = ref._getBoundingClientRect()

        return { ...original, height: Math.floor(original.height) }
      }
    }
  }

  // ** Scroll Menu
  const scrollMenu = (container: any) => {
    container = hidden ? container.target : container
    if (shadowRef && container.scrollTop > 0) {
      // @ts-ignore
      if (!shadowRef.current.classList.contains('d-block')) {
        // @ts-ignore
        shadowRef.current.classList.add('d-block')
      }
    } else {
      // @ts-ignore
      shadowRef.current.classList.remove('d-block')
    }
  }

  const ScrollWrapper = hidden ? Box : PerfectScrollbar

  const router = useRouter()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Drawer {...props}>
      <VerticalNavHeader {...props} />
      <StyledBoxForShadow
        ref={shadowRef}
        sx={{
          background: `linear-gradient(${theme.palette.background.default} 40%,${hexToRGBA(
            theme.palette.background.default,
            0.1
          )} 95%,${hexToRGBA(theme.palette.background.default, 0.05)})`
        }}
      />

      {session?.token ? (
        <>
          <IconButton
            sx={{ marginTop: 5, width: 40, marginLeft: 11, background: 'white', border: '1px solid lightgrey' }}
            color='primary'
            size='medium'
            onClick={handleClick}
          >
            <AddIcon fontSize='inherit' />
          </IconButton>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem
              onClick={() => {
                router.push('/task/create')
                handleClose()
              }}
            >
              New Task
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push('/supporting-package/create')
                handleClose()
              }}
            >
              New Supporting Package
            </MenuItem>
            <MenuItem
              onClick={() => {
                // router.push('/upload')
                setUploadFileOpen(true)
                handleClose()
              }}
            >
              Upload File
            </MenuItem>
          </Menu>
        </>
      ) : (
        <></>
      )}

      <Box sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
        {/* @ts-ignore */}
        <ScrollWrapper
          containerRef={(ref: any) => handleInfiniteScroll(ref)}
          {...(hidden
            ? {
                onScroll: (container: any) => scrollMenu(container),
                sx: { height: '100%', overflowY: 'auto', overflowX: 'hidden' }
              }
            : {
                options: { wheelPropagation: false },
                onScrollY: (container: any) => scrollMenu(container)
              })}
        >
          {beforeVerticalNavMenuContent ? beforeVerticalNavMenuContent(props) : null}
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {userVerticalNavMenuContent ? (
              userVerticalNavMenuContent(props)
            ) : (
              <List className='nav-items' sx={{ transition: 'padding .25s ease', pr: 4.5 }}>
                <VerticalNavItems
                  groupActive={groupActive}
                  setGroupActive={setGroupActive}
                  currentActiveGroup={currentActiveGroup}
                  setCurrentActiveGroup={setCurrentActiveGroup}
                  {...props}
                />
              </List>
            )}
          </Box>
        </ScrollWrapper>
      </Box>
      {afterVerticalNavMenuContent ? afterVerticalNavMenuContent(props) : null}

      <Dialog
        open={uploadFileOpen}
        onClose={handleUploadFileClose}
        aria-labelledby='modal-modal-journal'
        aria-describedby='modal-modal-journal'
        sx={{
          msOverflowX: 'scroll',
          paddingTop: 2
        }}
      >
        <Card>
          <CardHeader title='Upload a Document'></CardHeader>
          <CardContent>
            <Typography fontSize={12} align='right'>
              <label style={{ color: 'red ' }}>*</label>This form is autosave, please select a label and category before
              uploading the file
            </Typography>
            <Grid container>
              <Grid item md={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    id='tags-outlined'
                    options={categories.map(category => ({ label: category.name, uuid: category.uuid }))}
                    value={category}
                    onChange={(event: any, newValue: { label: string; uuid: string } | null) => {
                      setCategory(newValue)
                    }}
                    filterSelectedOptions
                    renderInput={params => (
                      <TextField variant='filled' {...params} label='Support Category' placeholder='Support Category' />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sx={{ pl: 1 }}>
                <FormControl fullWidth>
                  <Autocomplete
                    id='tags-outlined'
                    options={labels.map(label => ({ label: label.label, uuid: label.id }))}
                    value={label}
                    onChange={(event: any, newValue: { label: string; uuid: string } | null) => {
                      setLabel(newValue)
                    }}
                    filterSelectedOptions
                    renderInput={params => <TextField variant='filled' {...params} label='Label' placeholder='Label' />}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 10 }}>
              <FileUpload {...fileUploadProp()} />
            </Box>
          </CardContent>
          <CardActions>
            <Grid container justifyContent='flex-end' display='flex'>
              <Button
                type='reset'
                variant='contained'
                color='error'
                onClick={() => {
                  setUploadFileOpen(false)
                }}
              >
                Cancel
              </Button>
            </Grid>
          </CardActions>
        </Card>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackBar}
        autoHideDuration={10000}
        onClose={handleSnackBarClose}
      >
        <Alert onClose={handleSnackBarClose} severity={snackBarType} sx={{ width: '100%' }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <Backdrop sx={{ color: '#fff', zIndex: 100000 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Drawer>
  )
}

export default Navigation
