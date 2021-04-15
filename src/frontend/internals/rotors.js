import React from 'react'
import Rotor from './rotor.js'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles ((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1)
    }
  }  
}))

const RotorSettings = {
  'I' : {
    turnoverPosition: 17, // R
    mapping: 'jgdqoxuscamifrvtpnewkblzyh'
  },
  'II': {
    turnoverPosition: 5, // F
    mapping: 'ntzpsfbokmwrcjdivlaeyuxhgq'
  },
  'III': {
    turnoverPosition: 22, // W
    mapping: 'jviubhtcdyakeqzposgxnrmwfl'
  },
  'IV': {
    turnoverPosition: 10, // K
    mapping: 'qyhognecvpuztfdjaxwmkisrbl'
  },
  'V': {
    turnoverPosition: 0, // A
    mapping: 'qwertzuioasdfghjkpyxcvbnml'
  }
}

const rotate = (position) => {
  if (position < 25) return ++position
  else return 0
}

const Rotors = (props) => {
  const classes = useStyles()
  const {pressedKey, rotorPositions, setRotorPositions, types} = props


  React.useEffect(() => {
    let newPositions = [...rotorPositions]
    newPositions[2] = rotate(newPositions[2])
    if (newPositions[2] === RotorSettings[types[2]].turnoverPosition) {
      newPositions[1] = rotate(newPositions[1])
    }
    if (newPositions[1] === RotorSettings[types[1]].turnoverPosition) {
      newPositions[0] = rotate(newPositions[0])
    }
    setRotorPositions(newPositions)
  }, [pressedKey])

  
  return (
    <div className={classes.root}>
      <Rotor position={rotorPositions[0]} slot={2} mapping={RotorSettings[types[2]].mapping}/>
      <Rotor position={rotorPositions[1]} slot={1} mapping={RotorSettings[types[1]].mapping}/>
      <Rotor position={rotorPositions[2]} slot={0} mapping={RotorSettings[types[0]].mapping}/>
    </div>
  )
}

export default Rotors