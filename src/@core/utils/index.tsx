import { Box, Typography } from '@mui/material'
import { Row, SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet'

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
  type?: string | null
}

export interface AutocompleteRow {
  name: string
  uuid: string
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

export const isSupportedMimeType = (type: string) => {
  const supportedMimetypeKeywords = ['pdf', 'spreadsheet']

  return supportedMimetypeKeywords.some(mimetype => type.includes(mimetype))
}

export const mimetypeToIconImage = (type: string) => {
  const mimetypeImageMap = {
    pdf: '/images/icons/pdf.png',
    spreadsheet: '/images/icons/excel.png'
  }
  const mimetypeImageKey = Object.keys(mimetypeImageMap).find(mimetype => type.includes(mimetype))

  return mimetypeImageKey ? mimetypeImageMap[mimetypeImageKey as keyof typeof mimetypeImageMap] : undefined
}

const columnIndexToAddress = (n: number): string => {
  const a = Math.floor(n / 26)

  return a >= 0 ? columnIndexToAddress(a - 1) + String.fromCharCode(65 + (n % 26)) : ''
}

export const columnAddressToIndex = (index: string): number => {
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let i,
    j,
    result = 0

  for (i = 0, j = index.length - 1; i < index.length; i += 1, j -= 1) {
    result += Math.pow(base.length, j) * (base.indexOf(index[i]) + 1)
  }

  return result
}

export function getCellsFromRangeAddress(a: number, b: number, c: number, d: number): string[] {
  const cells = []
  for (let i = a; i <= c; i++) {
    for (let j = b; j <= d; j++) {
      const colLetters = columnIndexToAddress(j)
      cells.push(colLetters + (i + 1))
    }
  }

  return cells
}

export function getSpreadsheetRows(spreadsheet: SpreadsheetComponent): Promise<Row[]> {
  return new Promise((resolve, reject) => {
    spreadsheet
      .saveAsJson()
      .then(data => {
        const rows = (data as any).jsonObject.Workbook.sheets[0].rows
        rows.shift()
        resolve(rows)
      })
      .catch(err => reject(err))
  })
}

export function getDateWithoutTime(date: Date): string {
  return new Date(date).toDateString()
}

export function getMonthFromDate(date: Date | null): number {
  if (date) {
    return new Date(date).getMonth()
  }

  return new Date().getMonth()
}

export function getYearFromDate(date: Date): number {
  return new Date(date).getFullYear()
}
