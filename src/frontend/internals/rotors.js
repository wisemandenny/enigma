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

const shiftRight = (str, leftShifts, rightShifts) => shiftByAmount(shiftByAmount(str, leftShifts), -rightShifts)
const shiftByAmount = (str, leftShifts) => {
   leftShifts = leftShifts % str.length;
   return str.slice(leftShifts) + str.slice(0, leftShifts);
};

const Rotors = (props) => {
  const classes = useStyles()
  const {pressedKey, rotorPositions, setRotorPositions, setRotorOutputKey, types} = props
  const [rotorOutput0, setRotorOutput0] = React.useState([pressedKey, false])
  const [rotorOutput1, setRotorOutput1] = React.useState(['!', false])


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
      <Rotor slot={0} mapping={shiftRight(RotorSettings[types[0]].mapping, 0, rotorPositions[2])} turnover={RotorSettings[types[0]].turnoverPosition} input={pressedKey} setOutput={setRotorOutput0}/>
      <Rotor slot={1} mapping={shiftRight(RotorSettings[types[1]].mapping, 0, rotorPositions[1])} turnover={RotorSettings[types[1]].turnoverPosition} input={rotorOutput0} setOutput={setRotorOutput1}/>
      <Rotor slot={2} mapping={shiftRight(RotorSettings[types[2]].mapping, 0, rotorPositions[0])} turnover={RotorSettings[types[2]].turnoverPosition} input={rotorOutput1} setOutput={setRotorOutputKey}/>
    </div>
  )
}

export default Rotors