import * as React from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

// import Check from '@mui/icons-material/Check'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { StepIconProps } from '@mui/material/StepIcon'
import DateRangeIcon from '@mui/icons-material/DateRange'
import Chip from '@mui/material/Chip'
import { Grid } from '@mui/material'
import { getMonthFromDate } from 'src/@core/utils'

// const QontoConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: {
//     top: 10,
//     left: 'calc(-50% + 16px)',
//     right: 'calc(50% + 16px)'
//   },
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       borderColor: '#784af4'
//     }
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       borderColor: '#784af4'
//     }
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
//     borderTopWidth: 3,
//     borderRadius: 1
//   }
// }))

// const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
//   color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
//   display: 'flex',
//   height: 22,
//   alignItems: 'center',
//   ...(ownerState.active && {
//     color: '#784af4'
//   }),
//   '& .QontoStepIcon-completedIcon': {
//     color: '#784af4',
//     zIndex: 1,
//     fontSize: 18
//   },
//   '& .QontoStepIcon-circle': {
//     width: 8,
//     height: 8,
//     borderRadius: '50%',
//     backgroundColor: 'currentColor'
//   }
// }))

// function QontoStepIcon(props: StepIconProps) {
//   const { active, completed, className } = props

//   return (
//     <QontoStepIconRoot ownerState={{ active }} className={className}>
//       {completed ? <Check className='QontoStepIcon-completedIcon' /> : <div className='QontoStepIcon-circle' />}
//     </QontoStepIconRoot>
//   )
// }

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 18
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1
  }
}))

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient( 136deg, rgb(100,113,100) 0%, rgb(100,64,187) 50%, rgb(0,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,0.5)'
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)'
  })
}))

function ColorlibStepIcon(props: StepIconProps) {
  const { active, className } = props

  const icons: { [index: string]: React.ReactElement } = {
    1: <DateRangeIcon />,
    2: <DateRangeIcon />,
    3: <DateRangeIcon />,
    4: <DateRangeIcon />,
    5: <DateRangeIcon />,
    6: <DateRangeIcon />,
    7: <DateRangeIcon />,
    8: <DateRangeIcon />,
    9: <DateRangeIcon />,
    10: <DateRangeIcon />,
    11: <DateRangeIcon />,
    12: <DateRangeIcon />
  }

  return (
    <ColorlibStepIconRoot ownerState={{ active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

export default function MonthsStepper({
  startStep,
  year,
  selectedMonthStepper
}: {
  startStep: number
  year: string
  selectedMonthStepper: (index: number) => void
}) {
  const [activeStep, setActiveStep] = React.useState<number>(getMonthFromDate(new Date()) - startStep)
  const calcMonths = (startMonth: number): string[] => {
    const monthList: { [index: string]: string } = {
      1: 'JAN',
      2: 'FEB',
      3: 'MAR',
      4: 'APR',
      5: 'MAY',
      6: 'JUN',
      7: 'JUL',
      8: 'AUG',
      9: 'SEP',
      10: 'OCT',
      11: 'NOV',
      12: 'DEC'
    }
    const result: string[] = []
    for (let index = startMonth; index <= startMonth + 11; index++) {
      if (index <= 12) {
        result.push(monthList[String(index)])
      } else {
        result.push(monthList[String(index - 12)])
      }
    }

    return result
  }

  const steps = calcMonths(startStep)

  return (
    <>
      <Grid item md={3} spacing={10}>
        <Chip label={year} sx={{ width: '100%' }} variant='outlined' />
      </Grid>
      <Stack sx={{ width: '100%' }} spacing={1}>
        <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
          {steps.map((label, index) => (
            <Step
              key={label}
              onClick={() => {
                setActiveStep(index)
                selectedMonthStepper(index + startStep)
              }}
            >
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
    </>
  )
}
