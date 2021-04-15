import React from "react"
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}))

const Key = (props) => {
  const { char, onClick } = props
  const classes = useStyles()
  return (
    <Button variant="outlined" onClick={onClick}>{char}</Button>
  )
}

export default Key