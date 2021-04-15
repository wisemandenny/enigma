import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  }
}));

const alphabet = [...'abcdefghijklmnopqrstuvwxyz']

const shiftRight = (str, leftShifts, rightShifts) => shiftByAmount(shiftByAmount(str, leftShifts), -rightShifts)
// helper function
// negative amount shifts to right
// positive amount shifts to left
const shiftByAmount = (str, leftShifts) => {
   leftShifts = leftShifts % str.length;
   return str.slice(leftShifts) + str.slice(0, leftShifts);
};

const Rotor = (props) => {
  const classes = useStyles()
  const { position, mapping, turnover } = props
  const shiftedMapping = shiftRight(mapping, 0, position)

  return (
    <div className={classes.root}>
      <List component='nav' dense > 
      {alphabet.map((letter, index) => (
        <ListItem selected={index===turnover}>
            <ListItemText primary={letter.toUpperCase() + "->" + [...shiftedMapping][index].toUpperCase()} />
          </ListItem>
      ))}
      </List>
    </div>
  )
  
}

export default Rotor