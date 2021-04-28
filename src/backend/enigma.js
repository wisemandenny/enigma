const {  alphaToIndex, indexToAlpha, indexToNumeral, transform, inverseTransform, shiftRight } = require('./utils.js')
const { RotorSettings, Reflector } = require('./constants.js')

/* ENIGMA MACHINE BACKEND */
const setupRotors = (rotors) => {
  // build the rotors with mappings from the postedRotors with their types
  const rotorsWithMappings = rotors.map((rotor) => ({position: rotor.position, turnover: RotorSettings[rotor.type].turnover, notch: RotorSettings[rotor.type].notch, mapping: RotorSettings[rotor.type].mapping}))
  // transform the mappings from rotors.position
  const rotorsWithShiftedMappings = rotorsWithMappings.map((rotor) => ({mapping: shiftRight(rotor.mapping, rotor.position), ...rotor}))
  return rotorsWithShiftedMappings
}

const rotateAll = (rotors, direction=1) => {
  let newPositions = rotors.map((rotor) => ({position: rotor.position, notch: alphaToIndex(rotor.notch), turnover: alphaToIndex(rotor.turnover), mapping: rotor.mapping}))
  newPositions[0].position = rotate(newPositions[0].position, direction)
  if ((newPositions[0].notch + newPositions[0].position) % 26 === newPositions[1].turnover) {
    newPositions[1].position = rotate(newPositions[1].position, direction)
    if ((newPositions[1].notch + newPositions[1].position) % 26 === newPositions[2].turnover) {
      newPositions[2].position = rotate(newPositions[2].position, direction)
    }
  }
  return newPositions.map((rotor) => ({position: rotor.position, notch: indexToAlpha(rotor.notch), turnover: indexToAlpha(rotor.turnover), mapping: rotor.mapping}))
}

const rotate = (position, amount=1) => {
  // rotate a rotor
  // if (position < 26 - amount) return position + amount
  // else return position + amount - 26
  // test normal behavior
  // test backwards rotate when position = 0
  // test backwards rotate when position = 25
  if (amount > 0) return (position + amount) % 26
  else return (position + amount) === 0 ? 25 : position + amount
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

const encodeString = (input, rotorSettings) => {
  let outputString = "";
  let rotors = setupRotors(rotorSettings);

  [...input].forEach((char) => {
    const {rotatedRotors, outputChar } = encodeSingle(rotors, char)
    rotors = rotatedRotors
    outputString += outputChar
  })
  return {rotors, outputString}
}

module.exports = { setupRotors, rotateAll, rotate, encodeSingle, encodeString }