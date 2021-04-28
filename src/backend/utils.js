/* This file contains any functions needed in both the main server and the decoderWorker */
const { Alphabet } = require('./constants.js')

/* HELPER METHODS */

const alphaToIndex = (char) => Alphabet.indexOf(char)
const indexToAlpha = (index) => Alphabet[index]
const indexToNumeral = (index) => ['I', 'II', 'III', 'IV', 'V'][index]

/**
 * Given a character input [a-z] and a mapping (26 char string), return the encoded character
 * @param {*} char 
 * @param {*} mapping 
 */
 const transform = (char, mapping, rotation=0) => {
  const idx = Alphabet.indexOf(char)
  return [...(shiftRight(mapping, rotation))][idx]
}

const inverseTransform = (char, mapping, rotation) => {
  const idx = [...shiftRight(mapping, rotation)].indexOf(char)
  return Alphabet[idx]
}

const shiftRight = (str, rightShifts) => {
  const arr = Array.from(str)
  const net = -rightShifts % arr.length
  return [...arr.slice(net), ...arr.slice(0, net)].join('')
}

module.exports = {alphaToIndex, indexToAlpha, indexToNumeral, transform, inverseTransform, shiftRight}
