import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  }
}));

const alphabet = [...'abcdefghijklmnopqrstuvwxyz']

const Rotor = (props) => {
  const classes = useStyles()
  const { mapping, turnover, input, setOutput } = props
  React.useEffect(() => {
    setOutput([[...mapping][alphabet.indexOf(input[0])], !input[1]])
  }, [input, mapping])
  return (
    <div className={classes.root}>
      <List component='nav' dense > 
      {alphabet.map((letter, index) => (
        <ListItem selected={letter===input[0]} divider={index===turnover}>
            <ListItemText primary={letter.toUpperCase()}/>
          </ListItem>
      ))}
      </List>
      <List component='nav' dense>
        {alphabet.map((letter, index) => (
          <ListItem selected={letter===input[0]} divider={index===turnover}>
            <ListItemText primary={[...mapping][index].toUpperCase()} />
          </ListItem>
        ))}
      </List>
    </div>
  )
  
}

export default Rotor