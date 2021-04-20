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
  const trimmedInput = input.replace(/[\s\W\d]+/g, '').toUpperCase()
  req.ciphertext = trimmedInput
  next()
}

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

const bigrams = [
  { ngram: 'TH', frequency: 2.71 },        
  { ngram: 'EN', frequency: 1.13 },        
  { ngram: 'NG', frequency: 0.89 },
  { ngram: 'HE', frequency: 2.33 },        
  { ngram: 'AT', frequency: 1.12 },        
  { ngram: 'AL', frequency: 0.88 },
  { ngram: 'IN', frequency: 2.03 },        
  { ngram: 'ED', frequency: 1.08 },        
  { ngram: 'IT', frequency: 0.88 },
  { ngram: 'ER', frequency: 1.78 },        
  { ngram: 'ND', frequency: 1.07 },        
  { ngram: 'AS', frequency: 0.87 },
  { ngram: 'AN', frequency: 1.61 },        
  { ngram: 'TO', frequency: 1.07 },        
  { ngram: 'IS', frequency: 0.86 },
  { ngram: 'RE', frequency: 1.41 },        
  { ngram: 'OR', frequency: 1.06 },        
  { ngram: 'HA', frequency: 0.83 },
  { ngram: 'ES', frequency: 1.32 },        
  { ngram: 'EA', frequency: 1.00 },        
  { ngram: 'ET', frequency: 0.76 },
  { ngram: 'ON', frequency: 1.32 },        
  { ngram: 'TI', frequency: 0.99 },        
  { ngram: 'SE', frequency: 0.73 },
  { ngram: 'ST', frequency: 1.25 },        
  { ngram: 'AR', frequency: 0.98 },        
  { ngram: 'OU', frequency: 0.72 },
  { ngram: 'NT', frequency: 1.17 },        
  { ngram: 'TE', frequency: 0.98 },        
  { ngram: 'OF', frequency: 0.71 }
]

const trigrams = [
  { ngram: 'THE', frequency: 1.81 },        
  { ngram: 'ERE', frequency: 0.31 },        
  { ngram: 'HES', frequency: 0.24 },
  { ngram: 'AND', frequency: 0.73 },        
  { ngram: 'TIO', frequency: 0.31 },        
  { ngram: 'VER', frequency: 0.24 },
  { ngram: 'ING', frequency: 0.72 },        
  { ngram: 'TER', frequency: 0.30 },        
  { ngram: 'HIS', frequency: 0.24 },
  { ngram: 'ENT', frequency: 0.42 },        
  { ngram: 'EST', frequency: 0.28 },        
  { ngram: 'OFT', frequency: 0.22 },
  { ngram: 'ION', frequency: 0.42 },        
  { ngram: 'ERS', frequency: 0.28 },        
  { ngram: 'ITH', frequency: 0.21 },
  { ngram: 'HER', frequency: 0.36 },        
  { ngram: 'ATI', frequency: 0.26 },        
  { ngram: 'FTH', frequency: 0.21 },
  { ngram: 'FOR', frequency: 0.34 },        
  { ngram: 'HAT', frequency: 0.26 },        
  { ngram: 'STH', frequency: 0.21 },
  { ngram: 'THA', frequency: 0.33 },        
  { ngram: 'ATE', frequency: 0.25 },        
  { ngram: 'OTH', frequency: 0.21 },
  { ngram: 'NTH', frequency: 0.33 },        
  { ngram: 'ALL', frequency: 0.25 },        
  { ngram: 'RES', frequency: 0.21 },
  { ngram: 'INT', frequency: 0.32 },        
  { ngram: 'ETH', frequency: 0.24 },        
  { ngram: 'ONT', frequency: 0.20 }
]

const quadgrams = [
  { ngram: 'TION', frequency:  0.31 },        
  { ngram: 'OTHE', frequency:  0.16 },        
  { ngram: 'THEM', frequency:  0.12 },
  { ngram: 'NTHE', frequency:  0.27 },        
  { ngram: 'TTHE', frequency:  0.16 },        
  { ngram: 'RTHE', frequency:  0.12 },
  { ngram: 'THER', frequency:  0.24 },        
  { ngram: 'DTHE', frequency:  0.15 },        
  { ngram: 'THEP', frequency:  0.11 },
  { ngram: 'THAT', frequency:  0.21 },        
  { ngram: 'INGT', frequency:  0.15 },        
  { ngram: 'FROM', frequency:  0.10 },
  { ngram: 'OFTH', frequency:  0.19 },        
  { ngram: 'ETHE', frequency:  0.15 },        
  { ngram: 'THIS', frequency:  0.10 },
  { ngram: 'FTHE', frequency:  0.19 },        
  { ngram: 'SAND', frequency:  0.14 },        
  { ngram: 'TING', frequency:  0.10 },
  { ngram: 'THES', frequency:  0.18 },        
  { ngram: 'STHE', frequency:  0.14 },        
  { ngram: 'THEI', frequency:  0.10 },
  { ngram: 'WITH', frequency:  0.18 },        
  { ngram: 'HERE', frequency:  0.13 },        
  { ngram: 'NGTH', frequency:  0.10 },
  { ngram: 'INTH', frequency:  0.17 },        
  { ngram: 'THEC', frequency:  0.13 },        
  { ngram: 'IONS', frequency:  0.10 },
  { ngram: 'ATIO', frequency:  0.17 },        
  { ngram: 'MENT', frequency:  0.12 },        
  { ngram: 'ANDT', frequency:  0.10 }
]

/* HELPER METHODS */

const alphaToIndex = (char) => alphabet.indexOf(char)
const indexToAlpha = (index) => alphabet[index]
const indexToNumeral = (index) => ['I', 'II', 'III', 'IV', 'V'][index]

/**
 * Given a character input [a-z] and a mapping (26 char string), return the encoded character
 * @param {*} char 
 * @param {*} mapping 
 */
 const transform = (char, mapping, rotation=0) => {
  const idx = alphabet.indexOf(char)
  return [...(shiftRight(mapping, rotation))][idx]
}

const inverseTransform = (char, mapping, rotation) => {
  const idx = [...shiftRight(mapping, rotation)].indexOf(char)
  return alphabet[idx]
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
  method: function(ciphertext){ return ngramScore(ciphertext, bigrams) },
  minScore: 0.17,
  maxScore: 0.5
}
const trigramScore = {
  method: function(ciphertext){ return ngramScore(ciphertext, trigrams) },
  minScore: 0,
  maxScore: 0.08
}

const quadgramScore = {
  method: function (ciphertext){ return ngramScore(ciphertext, quadgrams) },
  minScore: 0,
  maxScore: 0.01
}

const indexOfCoincidence = {
  method: function(ciphertext) {
    const N = ciphertext.length
    const c = 26
    const sums = alphabet.map((letter) => ([...ciphertext]).filter((cipherLetter) => cipherLetter === letter).length)
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
