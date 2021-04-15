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

const Rotor = (props) => {
  const classes = useStyles()
  const { position, mapping } = props

  return (
    <div className={classes.root}>
      <List component='nav' dense > 
      {alphabet.map((letter, index) => (
        <ListItem selected={index===position}>
            <ListItemText primary={letter.toUpperCase() + "->" + [...mapping][index].toUpperCase()} />
          </ListItem>
      ))}
      </List>
    </div>
  )
  
}

export default Rotor