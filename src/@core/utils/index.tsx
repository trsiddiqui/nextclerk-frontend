import { Box, Typography } from '@mui/material'

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: number
  value: number
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

export interface DropDownRow {
  label: string
  id: string
  key: string
}

export interface User {
  name: string
  email: string
  id: string
}

export const getInitials = (name: string) => {
  return name
    .match(/(\b\S)?/g)!
    .join('')
    .match(/(^\S|\S$)?/g)!
    .join('')
    .toUpperCase()
}
