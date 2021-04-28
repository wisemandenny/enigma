const { Alphabet, RotorSettings, Reflector, Bigrams, Trigrams, Quadgrams } = require('./constants.js')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const port = process.env.PORT || 3001

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const sanitizeInput = (req, res, next) => {
  const input = req.body.input ? req.body.input : req.body.ciphertext
  const trimmedInput = input.replace(/[\s\W\d]+/g, '')?.toUpperCase()
  req.ciphertext = trimmedInput
  next()
}



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

/* CRYPTANALYSIS METHODS */

const ngramScore = (ciphertext, ngrams) => {
  const counts = ngrams.map((ngram) => {
    const matches = ciphertext.match(new RegExp(ngram.ngram, 'g'))
    return matches ? matches.length * ngram.frequency : 0
  })
  const score = counts.reduce((acc, curr) => acc + curr, 0)
  return score / ciphertext.length
}

const bigramScore = {
  method: function(ciphertext){ return ngramScore(ciphertext, Bigrams) },
  minScore: 0.17,
  maxScore: 0.5
}
const trigramScore = {
  method: function(ciphertext){ return ngramScore(ciphertext, Trigrams) },
  minScore: 0,
  maxScore: 0.08
}

const quadgramScore = {
  method: function (ciphertext){ return ngramScore(ciphertext, Quadgrams) },
  minScore: 0,
  maxScore: 0.01
}

const indexOfCoincidence = {
  method: function(ciphertext) {
    const N = ciphertext.length
    const c = 26
    const sums = Alphabet.map((letter) => ([...ciphertext]).filter((cipherLetter) => cipherLetter === letter).length)
    const result = sums.reduce((acc, curr) => acc + ((curr / N) * (curr - 1) / (N-1)), 0)
    return result
  },
  minScore: 0.06,
  maxScore: 0.068
}

const findMax = (ciphertext, scoringMethod) => {
  const top3 = []
  const rotors = RotorSettings
  rotors['I'].position = 0;
  rotors['II'].position = 0;
  rotors['III'].position = 0;
  rotors['IV'].position = 0;
  rotors['V'].position = 0;
  rotors['I'].type = 'I';
  rotors['II'].type = 'II';
  rotors['III'].type = 'III';
  rotors['IV'].type = 'IV';
  rotors['V'].type = 'V';
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      for (let k = 0; k < 5; k++) {
        if (i === j || i === k || j === k) continue
        const _i = indexToNumeral(i)
        const _j = indexToNumeral(j)
        const _k = indexToNumeral(k)
        const rotor0 = rotors[_i]
        const rotor1 = rotors[_j]
        const rotor2 = rotors[_k]
        const max = {score: 0}
        // try each starting position for each rotor. 
        rotor2:
        for (let l = 0; l < 26; l++) {
          for (let m = 0; m < 26; m++) {
            for (let n = 0; n < 26; n++) {
              rotor0.position = n
              rotor1.position = m
              rotor2.position = l
              const encoded = encodeString(ciphertext, [rotor0, rotor1, rotor2])
              const encodedScore = scoringMethod.method(encoded.outputString)
              // record the new highest score configuration
              if (encodedScore > max.score) {
                max.rotors = [
                  { type: rotor0.type, pos: n },
                  { type: rotor1.type, pos: m },
                  { type: rotor2.type, pos: l }
                ]
                max.decoded = encoded.outputString
                max.score = encodedScore
              }
            }
          }
          // if this is not a promising configuration, skip to the next rotor set permutation
          if (max.score < scoringMethod.minScore) {
            break rotor2
          }
          else if (max.score >= scoringMethod.maxScore) {
            return max // we have decoded the ciphertext so only return the plaintext trial
          }
        }
        // when we finish any given rotor set permutation, record the rotor start position configuration with the highest score
        if (top3.length < 3) {
          top3.push(max)
        } 
        else {
          // sort in descending order by score
          top3.sort((a, b) => a.score - b.score)
          if (top3[2].score < max.score) {
            top3[2] = max
          }
        }
        console.log(max.rotors[0].type, ':', max.rotors[0].pos, 
          max.rotors[1].type, ':', max.rotors[1].pos,
          max.rotors[2].type, ':', max.rotors[2].pos, '\n',
          max.decoded,
          '(', max.score, ')') 
      }
    }
  }
  return top3
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

/* =========== ROUTES =========== */
// Cracks the enigma code with the IOC method for ciphertext-only attack
app.post('/enigma/crack/ioc', sanitizeInput, (req, res) => {
  const { ciphertext } = req
  console.log(`Cracking method: index of coincidence \nCiphertext: ${ciphertext}.\n`)
  const top3 = findMax(ciphertext, indexOfCoincidence)
  res.status(200).send(top3)
})

// Cracks the enigma code with bigram score method for ciphertext-only attack
app.post('/enigma/crack/bigram', sanitizeInput, (req, res) => {
  const { ciphertext } = req
  console.log(`Cracking method: bigram scoring \nCiphertext: ${ciphertext}\n`)
  const top3 = findMax(ciphertext, bigramScore)
  res.status(200).send(top3)
})

app.post('/enigma/crack/trigram', sanitizeInput, (req, res) => {
  const { ciphertext } = req
  console.log(`Cracking method: trigram scoring \nCiphertext: ${ciphertext}.\n`)
  const top3 = findMax(ciphertext, trigramScore)
  res.status(200).send(top3)
})

app.post('/enigma/crack/quadgram', sanitizeInput, (req, res) => {
  const { ciphertext } = req
  console.log(`Cracking method: quadgram scoring \nCiphertext: ${ciphertext}.\n`)
  const top3 = findMax(ciphertext, quadgramScore)
  res.status(200).send(top3)
})

app.post('/enigma/encode/single', sanitizeInput, (req, res) => {
  const { rotors } = req.body
  const input = req.ciphertext
  const {rotatedRotors, outputChar } = encodeSingle(setupRotors(rotors), input)
  res.send({rotors: rotatedRotors, outputString: outputChar})
})

app.post('/enigma/encode/deleteSingle', (req, res) => {
  const { rotors } = req.body
  const backwardsRotated = rotateAll(setupRotors(rotors), -1)
  res.send({rotors: backwardsRotated})
})

app.post('/enigma/encode/string', sanitizeInput, (req, res) => {
  const { rotors} = req.body
  const input = req.ciphertext
  const encoded = encodeString(input, rotors)
  res.send(encoded)
})

app.get('/enigma/crack/cancel', (req, res) => {
  // TODO: multithreading necessary to interrupt currently executing cracks
})

app.listen(port, () => console.log(`Listening on port ${port}...\n`))

