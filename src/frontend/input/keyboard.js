import React from 'react'
import Key from './key'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { makeStyles } from '@material-ui/core/styles'

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

const Keyboard = (props) => {
  const classes = useStyles()
  const {dupKeyToggle, setPressedKey} = props

  const onClick = (key) => {
    console.log("pressed ", key)
    setPressedKey([key, !dupKeyToggle])
  }

  return (
    <div className={classes.root}>
      <ButtonGroup>
        {[...'qwertyuiop'].map((char) => <Key char={char} onClick={() => onClick(char)}/>)}
      </ButtonGroup>
      <ButtonGroup>
        {[...'asdfghjkl'].map((char) => <Key char={char} onClick={() => onClick(char)}/>)}
      </ButtonGroup>
      <ButtonGroup>
        {[...'zxcvbnm'].map((char) => <Key char={char} onClick={() => onClick(char)}/>)}
      </ButtonGroup>
    </div>
  )
}

export default Keyboard