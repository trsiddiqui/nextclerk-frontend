import React from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import clsx from 'clsx'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

export type FileUploadProps = {
  imageButton?: boolean
  accept: string
  hoverLabel?: string
  dropLabel?: string
  width?: string
  height?: string
  backgroundColor?: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDrop: (event: React.DragEvent<HTMLElement>) => void
}

const useStyle = makeStyles({
  root: {
    cursor: 'pointer',
    textAlign: 'center',
    display: 'flex',
    '&:hover p,&:hover svg,& img': {
      opacity: 1
    },
    '& p, svg': {
      opacity: 0.4
    },
    '&:hover img': {
      opacity: 0.3
    }
  },
  noMouseEvent: {
    pointerEvents: 'none'
  },
  iconText: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute'
  },
  hidden: {
    display: 'none'
  },
  onDragOver: {
    '& img': {
      opacity: 0.3
    },
    '& p, svg': {
      opacity: 1
    }
  }
})

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  imageButton = false,
  hoverLabel = 'Click or drag to upload file',
  dropLabel = 'Drop file here',
  width = '600px',
  height = '100px',
  backgroundColor = '#fff',
  onChange,
  onDrop
}) => {
  const classes = useStyle()
  const [labelText, setLabelText] = React.useState<string>(hoverLabel)
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false)
  const [isMouseOver, setIsMouseOver] = React.useState<boolean>(false)
  const stopDefaults = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }
  const dragEvents = {
    onMouseEnter: () => {
      setIsMouseOver(true)
    },
    onMouseLeave: () => {
      setIsMouseOver(false)
    },
    onDragEnter: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(true)
      setLabelText(dropLabel)
    },
    onDragLeave: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(false)
      setLabelText(hoverLabel)
    },
    onDragOver: stopDefaults,
    onDrop: (e: React.DragEvent<HTMLElement>) => {
      stopDefaults(e)
      setLabelText(hoverLabel)
      setIsDragOver(false)
      onDrop(e)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event)
  }

  return (
    <>
      <input onChange={handleChange} accept={accept} className={classes.hidden} id='file-upload' type='file' />

      <label htmlFor='file-upload' {...dragEvents} className={clsx(classes.root, isDragOver && classes.onDragOver)}>
        <Box width={width} height={height} bgcolor={backgroundColor} className={classes.noMouseEvent}>
          {(!imageButton || isDragOver || isMouseOver) && (
            <>
              <Box height={height} width={width} className={classes.iconText}>
                <CloudUploadIcon fontSize='large' />
                <Typography>{labelText}</Typography>
              </Box>
            </>
          )}
        </Box>
      </label>
    </>
  )
}
