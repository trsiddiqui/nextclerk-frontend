// ** React Imports
import { useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Collapse from '@mui/material/Collapse'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import { Link, styled, TableCell, tableCellClasses, TableCellProps } from '@mui/material'

const createData = (name: string, calories: number, fat: number, carbs: number, protein: number, price: number) => {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1
      }
    ]
  }
}

const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const Row = (props: { row: ReturnType<typeof createData> }) => {
  // ** Props
  const { row } = props

  // ** State
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell>
          <Link href='#'>Select</Link>
        </StyledTableCell>
        <StyledTableCell component='th' scope='row'>
          {row.name}
        </StyledTableCell>
        <StyledTableCell align='right'>{row.calories}</StyledTableCell>
        <StyledTableCell align='right'>{row.fat}</StyledTableCell>
        <StyledTableCell align='right'>{row.carbs}</StyledTableCell>
        <StyledTableCell align='right'>{row.protein}</StyledTableCell>
        <StyledTableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </IconButton>
        </StyledTableCell>
      </TableRow>
      <TableRow>
        <StyledTableCell colSpan={7} sx={{ py: '0 !important' }}>
          <Collapse in={open} timeout='auto' unmountOnExit radioGroup='abc'>
            <Box sx={{ m: 2 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Line Items
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Customer</StyledTableCell>
                    <StyledTableCell align='right'>Amount</StyledTableCell>
                    <StyledTableCell align='right'>Total price ($)</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map(historyRow => (
                    <TableRow key={historyRow.date}>
                      <StyledTableCell component='th' scope='row'>
                        {historyRow.date}
                      </StyledTableCell>
                      <StyledTableCell>{historyRow.customerId}</StyledTableCell>
                      <StyledTableCell align='right'>{historyRow.amount}</StyledTableCell>
                      <StyledTableCell align='right'>
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </Fragment>
  )
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5)
]

const TableCollapsible = () => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <StyledTableCell />
            <StyledTableCell>Dessert (100g serving)</StyledTableCell>
            <StyledTableCell align='right'>Calories</StyledTableCell>
            <StyledTableCell align='right'>Fat (g)</StyledTableCell>
            <StyledTableCell align='right'>Carbs (g)</StyledTableCell>
            <StyledTableCell align='right'>Protein (g)</StyledTableCell>
            <StyledTableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableCollapsible
