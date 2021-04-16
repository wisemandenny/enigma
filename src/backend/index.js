const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')

const port = process.env.PORT || 3001

const app = express()

app.use(session({
  secret: 'mysecret', //TODO: change this
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000,
    httpOnly: true
  }
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
const RotorSettings = {
  'I' : {
    turnover: 'Q',
    notch: 'Y',
    mapping: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ'
  },
  'II': {
    turnover: 'E',
    notch: 'M',
    mapping: 'AJDKSIRUXBLHWTMCQGZNPYFVOE'
  },
  'III': {
    turnover: 'V',
    notch: 'D',
    mapping: 'BDFHJLCPRTXVZNYEIWGAKMUSQO'
  },
  'IV': {
    turnover: 'J',
    notch: 'R',
    mapping: 'ESOVPZJAYQUIRHXLNFTGKDCMWB'
  },
  'V': {
    turnover: 'Z',
    notch: 'H',
    mapping: 'VZBRGITYUPSDNHLXAWMJQOFECK'
  }
}

const Reflector = {
  mapping: 'YRUHQSLDPXNGOKMIEBFZCWVJAT'
}

const alphaToIndex = (char) => [...alphabet].indexOf(char)
const indexToAlpha = (index) => alphabet[index]

const shiftRight = (str, leftShifts, rightShifts) => shiftByAmount(shiftByAmount(str, leftShifts), -rightShifts)
const shiftByAmount = (str, leftShifts) => {
   leftShifts = leftShifts % str.length
   return str.slice(leftShifts) + str.slice(0, leftShifts)
};

const setupRotors = (rotors) => {
  // build the rotors with mappings from the postedRotors with their types
  const rotorsWithMappings = rotors.map((rotor) => ({position: rotor.position, turnover: RotorSettings[rotor.type].turnover, notch: RotorSettings[rotor.type].notch, mapping: RotorSettings[rotor.type].mapping}))
  // transform the mappings from rotors.position
  const rotorsWithShiftedMappings = rotorsWithMappings.map((rotor) => ({mapping: shiftRight(rotor.mapping, 0, rotor.position), ...rotor}))
  return rotorsWithShiftedMappings
}

const rotateAll = (rotors) => {
  let newPositions = rotors.map((rotor) => ({position: rotor.position, notch: alphaToIndex(rotor.notch), turnover: alphaToIndex(rotor.turnover), mapping: rotor.mapping}))
  newPositions[0].position = rotate(newPositions[0].position)
  if (newPositions[0].notch + newPositions[0].position === newPositions[1].turnover) {
    newPositions[1].position = rotate(newPositions[1].position)
  }
  if (newPositions[1].notch + newPositions[1].position === newPositions[2].turnover) {
    newPositions[2].position = rotate(newPositions[2].position)
  }
  return newPositions.map((rotor) => ({position: rotor.position, notch: indexToAlpha(rotor.notch), turnover: indexToAlpha(rotor.turnover), mapping: rotor.mapping}))
}

const rotate = (position, amount=1) => {
  // rotate a rotor
  if (position < 26 - amount) return position + amount
  else return position + amount - 26
}

/**
 * Given a character input [a-z] and a mapping (26 char string), return the encoded character
 * @param {*} char 
 * @param {*} mapping 
 */
const transform = (char, mapping, rotation=0) => {
  const idx = alphabet.indexOf(char)
  return [...(shiftRight(mapping, 0, rotation))][idx]
}

const inverseTransform = (char, mapping, rotation) => {
  const idx = [...shiftRight(mapping, 0, rotation)].indexOf(char)
  return [...alphabet][idx]
}

const encodeSingle = (rotors, inputChar) => {
  const rotatedRotors = rotateAll(rotors)
  const outR0 = transform(inputChar, rotatedRotors[0].mapping, rotatedRotors[0].position)
  const outR1 = transform(outR0, rotatedRotors[1].mapping, rotatedRotors[1].position)
  const outR2 = transform(outR1, rotatedRotors[2].mapping, rotatedRotors[2].position)
  const outReflector = transform(outR2, Reflector.mapping)
  const inR2 = inverseTransform(outReflector, rotatedRotors[2].mapping, rotatedRotors[2].position)
  const inR1 = inverseTransform(inR2, rotatedRotors[1].mapping, rotatedRotors[1].position)
  const outputChar = inverseTransform(inR1, rotatedRotors[0].mapping, rotatedRotors[0].position)
  return {rotatedRotors, outputChar}

}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

/* =========== ROUTES =========== */
app.post('/enigma/encode/single', (req, res) => {
  // rotors: [ {type: 'V', position: 2},  {type: 'I', position: 4}, {type: 'II', position: 12}]
  // input: 'A'
  const { rotors, input } = req.body
  const result = encodeSingle(rotors, input)
  res.send(result)
})

app.post('/enigma/encode/string', (req, res) => {
  const { input } = req.body
  let rotors = setupRotors(req.body.rotors);
  let outputString = "";

  [...input].forEach((char) => {
    const {rotatedRotors, outputChar } = encodeSingle(rotors, char)
    rotors = rotatedRotors
    outputString += outputChar
  })
  res.send({rotors, outputString})
})

app.listen(port, () => console.log(`Listening on port ${port}...`))