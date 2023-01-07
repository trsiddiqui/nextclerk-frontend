// ** React Imports
import { ChangeEvent, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

// ** Icons Imports
import { FormControlLabel, Link, Switch } from '@mui/material'

interface State {
  name: string
}

const CreateSupportPackage = () => {
  // ** States
  const [values, setValues] = useState<State>({
    name: ''
  })

  // Handle Password
  const handleStateChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  return (
    <Card>
      <CardHeader title='Create a Supporting Package' titleTypographyProps={{ variant: 'h6' }}></CardHeader>
      <Divider sx={{ margin: 0 }} />

      <FormControlLabel control={<Switch defaultChecked />} label='Confidential' />
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Package Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label='Support Name'
                placeholder='Name of Support Package'
                onChange={handleStateChange('name')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label='Support Period' placeholder='Q1 2022' />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type='number' label='Support Number' placeholder='carterleonard@gmail.com' />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label='Support Date' placeholder='Name of Support Package' />
            </Grid>
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Support Category</InputLabel>
                <Select
                  label='Support Category'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='CAT1'>Category 1</MenuItem>
                  <MenuItem value='CAT2'>Category 2</MenuItem>
                  <MenuItem value='CAT3'>Category 3</MenuItem>
                  <MenuItem value='CAT4'>Category 4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. Link to a Journal &nbsp;&nbsp;<Link>Link</Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label='Journal Number' placeholder='Name of Support Package' disabled />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField fullWidth label='Labels' placeholder='Assign Labels' />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                3. Personnel
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Link component='button' variant='body2'>
                Select an Approver
              </Link>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Link component='button' variant='body2'>
                Select Participant(s)
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            Submit
          </Button>
          <Button size='large' color='secondary' variant='outlined'>
            Cancel
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default CreateSupportPackage
