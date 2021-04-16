import React from 'react'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { makeStyles } from '@material-ui/core/styles'
import Lamp from './lamp.js'

const useStyles = makeStyles ((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}))

const LampBoard = (props) => {
  const classes = useStyles()
  const {litLamp} = props

  return (
    <div className={classes.root}>
       <ButtonGroup>
        {[...'qwertyuiop'].map((char) => <Lamp char={char} isLit={char===litLamp} />)}
      </ButtonGroup>
      <ButtonGroup>
        {[...'asdfghjkl'].map((char) => <Lamp char={char} isLit={char===litLamp} />)}
      </ButtonGroup>
      <ButtonGroup>
        {[...'zxcvbnm'].map((char) => <Lamp char={char} isLit={char===litLamp} />)}
      </ButtonGroup>
    </div>
  )
}

export default LampBoard