import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const RotorInit = (props) => {
  const classes = useStyles()
  const {rotorPositions, setRotorPositions} = props
  let newRotorPositions = rotorPositions.map((pos, idx) => ({idx, pos}))
  const handleChange = (event) => {
    if (event.target.id.endsWith('0')) {
      newRotorPositions[0].pos = event.target.value;
    } else if (event.target.id.endsWith('1')) {
      newRotorPositions[1].pos = event.target.value;
    } else {
      newRotorPositions[2].pos = event.target.value;
    }
    setRotorPositions(newRotorPositions.map((pos) => pos.pos))
  }

  return (
    <form className={classes.root} noValidate autoComplete='off'>
      <TextField id="standard-number-0" label="Rotor 1" type="number" value={rotorPositions[0]} onChange={handleChange} InputLabelProps={{shrink: true,}}/>
      <TextField id="standard-number-1" label="Rotor 2" type="number" value={rotorPositions[1]} onChange={handleChange} InputLabelProps={{shrink: true,}}/>
      <TextField id="standard-number-2" label="Rotor 3" type="number" value={rotorPositions[2]} onChange={handleChange} InputLabelProps={{shrink: true,}}/>
    </form>
  )
}

export default RotorInit