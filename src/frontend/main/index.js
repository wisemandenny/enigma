import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import MenuItem from '@material-ui/core/MenuItem'
import Switch from '@material-ui/core/Switch';

import {postEncodeString, postCrack} from './serverMethods.js'

function CreatedBy() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Created by '}
      <Link color="inherit" href="https://github.com/wisemandenny">
      Denny Wiseman
      </Link>{'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  rotorPositions: {
    marginTop: theme.spacing(1),
  },
  settings: {
    marginTop: theme.spacing(1)
  }
}));

const romanNumerals = ['I', 'II', 'III', 'IV', 'V']
const numeralToIndex = (romanNumeral) => romanNumerals.indexOf(romanNumeral)
const indexToNumeral = (index) => romanNumerals[index]

export default function SignIn() {
  const classes = useStyles();
  const [inputText, setInputText] = React.useState('')
  const [outputText, setOutputText] = React.useState('')
  const [rotorTypes, setRotorTypes] = React.useState(['I', 'II', 'III'])
  const [rotorPos, setRotorPos] = React.useState([0, 0, 0])
  const [crackMode, setCrackMode] = React.useState(false) // false = encode/decode, true = crack mode
  const [isCracking, setIsCracking] = React.useState(false)
  const [crackMethod, setCrackMethod] = React.useState(0) // 0: IoC, 1: bigram, 2: trigram, 3: quadgram
  const [crackScore, setCrackScore] = React.useState(0)

  const takenRotors = romanNumerals.filter((numeral) => rotorTypes.includes(numeral))

  const handleEncodeClick = (event) => {
    const rotors = rotorTypes.map((type, idx) => ({type, position: rotorPos[idx]}))
    const req = {rotors: [...rotors], input: inputText}
    console.log(req)
    postEncodeString(req).then((res) => {
      setOutputText(res.outputString)
      setRotorPos(res.rotors.map((rotor) => rotor.position))
    })
  }

  const handleCrackClick = (event) => {
    const type = ['ioc', 'bigram', 'trigram', 'quadgram'][crackMethod]
    const req = {type, inputText}
    postCrack(req).then((res) => {
      setOutputText(res.decoded)
      setRotorTypes(res.rotors.map((rotor) => rotor.type))
      setRotorPos(res.rotors.map((rotor) => rotor.pos))
      setCrackScore(res.score)
    })
  }

  const handleIsCrackingChange = (event) => {
    setIsCracking(!isCracking)
  }

  const handleInputTextChange = (event) => {
    setInputText(event.target.value)
  }

  const handleCrackModeChange = (event) => {
    setCrackMode(!crackMode)
  }

  const handleRotorTypeChange = (event) => {
    const current = [...rotorTypes];
    const rotorIdx = parseInt(event.target.name.slice(-1))
    if (event.target.value !== '') {
      if (!takenRotors[numeralToIndex(event.target.value)]) {
        current[rotorIdx] = event.target.value
        setRotorTypes(current)
      }
    }
    else {
      current[rotorIdx] = ''
      setRotorTypes(current)
    }
  }

  const handleRotorPosChange = (event) => {
    const rotorIdx = parseInt(event.target.name.slice(-1))
    let current = [...rotorPos]
    const newNum = parseInt(event.target.value)
    current[rotorIdx] = newNum
    setRotorPos(current)
  }

  const handleCrackMethodChange = (event) => {
    setCrackMethod(parseInt(event.target.value))
  }

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          Enigma Machine
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="plaintext"
            label="Input"
            name="plaintext"
            onChange={handleInputTextChange}
            autoFocus
            multiline
            rows={5}
          />
          <TextField
            variant="filled"
            margin="normal"
            fullWidth
            name="output"
            label={ crackMode ? (crackScore > 0 ? `Cracked Plaintext (score = ${crackScore})` : `Cracked Plaintext`) : "Encoded Output"}
            id="output"
            value={outputText}
            InputProps={{
              readOnly: true,
            }}
            multiline
            rows={5}
          />
          <Button
            onClick={crackMode ? (isCracking ? handleIsCrackingChange : handleCrackClick) : handleEncodeClick}
            fullWidth
            variant="contained"
            color={crackMode ? (isCracking ? 'secondary' : 'primary' )  : 'primary'}
            className={classes.submit}
          >
            {crackMode ? (isCracking ? 'Cancel' : 'Crack') : 'Encode'}
          </Button>
          <Grid container>
            <Grid item xs>
              <FormGroup>
                <FormControlLabel 
                  control={<Switch checked={crackMode} onChange={handleCrackModeChange} name='isCrackSwitch' color={crackMode ? 'secondary' : 'primary'}/>}
                  label='Codebreaking Mode'
                  />
              </FormGroup>
            </Grid>
            { !crackMode ? <div /> : 
            <FormControl component='fieldset'>
              <RadioGroup row value={crackMethod} onChange={handleCrackMethodChange}>
                <FormControlLabel value={0} control={<Radio />} label="Index of Coincidence" />
                <FormControlLabel value={1} control={<Radio />} label="Bigram Score" />
                <FormControlLabel value={2} control={<Radio />} label="Trigram Score" />
                <FormControlLabel value={3} control={<Radio />} label="Quadgram Score" />
              </RadioGroup>
            </FormControl>}
          </Grid>
        </form>
      </div>
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
            Settings
        </Typography>
        <Grid container className={classes.settings}>
          <Grid container spacing={4} className={classes.rotorTypes}>
            <Grid container item xs>
              <TextField
                  id="standard-number-rotor0-type"
                  select
                  fullWidth
                  label="Rotor 1 Type"
                  value={rotorTypes[0]}
                  variant="outlined"
                  onChange={handleRotorTypeChange}
                  name="rotor0"
              >
                {romanNumerals.map((numeral) => <MenuItem key={`rotor0-type-${numeral}`} value={numeral} disabled={takenRotors.includes(numeral)}>{numeral}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid container item xs>
              <TextField
                id="standard-number-rotor1-type"
                select
                fullWidth
                label="Rotor 2 Type"
                value={rotorTypes[1]}
                variant="outlined"
                onChange={handleRotorTypeChange}
                name="rotor1"
              >
                {romanNumerals.map((numeral) => <MenuItem key={`rotor1-type-${numeral}`} value={numeral} disabled={takenRotors.includes(numeral)}>{numeral}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid container item xs>
              <TextField
                id="standard-number-rotor2-type"
                select
                fullWidth
                label="Rotor 3 Type"
                value={rotorTypes[2]}
                variant="outlined"
                onChange={handleRotorTypeChange}
                name="rotor2"
              >
                {romanNumerals.map((numeral) => <MenuItem key={`rotor2-type-${numeral}`} value={numeral} disabled={takenRotors.includes(numeral)}>{numeral}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.rotorPositions}>
            <Grid container item xs>
              <TextField
                error={(rotorPos[0] < 0 || rotorPos[0] >= 26)}
                id="standard-number-rotor0-start-pos"
                type="number"
                label="Rotor 1 Starting Position"
                value={rotorPos[0]}
                helperText={(rotorPos[0] < 0 || rotorPos[0] >= 26) ? 'Must be an integer between 0 and 25' : ''}
                variant="outlined"
                fullWidth
                onChange={handleRotorPosChange}
                name="rotor0"
              />
            </Grid>
            <Grid container item xs>
              <TextField
                error={(rotorPos[1] < 0 || rotorPos[1] >= 26)}
                id="outlined-number-rotor1-start-pos"
                type="number"
                label="Rotor 2 Starting Position"
                value={rotorPos[1]}
                helperText={(rotorPos[1] < 0 || rotorPos[1] >= 26) ? 'Must be an integer between 0 and 25' : ''}
                variant="outlined"
                fullWidth
                onChange={handleRotorPosChange}
                name="rotor1"
              />
            </Grid>
            <Grid container item xs>
              <TextField
                error={(rotorPos[2] < 0 || rotorPos[2] >= 26)}
                id="outlined-number-rotor2-start-pos"
                type="number"
                label="Rotor 3 Starting Position"
                value={rotorPos[2]}
                helperText={(rotorPos[2] < 0 || rotorPos[2] >= 26) ? 'Must be an integer between 0 and 25' : ''}
                variant="outlined"
                fullWidth
                onChange={handleRotorPosChange}
                name="rotor2"
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
      <Box mt={8}>
        <CreatedBy />
      </Box>
    </Container>
  );
}