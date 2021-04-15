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

const Lamp = (props) => {
  const {char, isLit } = props
  const classes = useStyles()
  return (
    <Button variant={isLit ? 'contained' : 'outlined'} disabled>{char}</Button>
  )
}

export default Lamp