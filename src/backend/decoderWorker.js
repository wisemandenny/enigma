const {  alphaToIndex, indexToAlpha, indexToNumeral, transform, inverseTransform, shiftRight } = require('./utils.js')
const { setupRotors, rotateAll, rotate, encodeSingle, encodeString } = require('./enigma.js')
const { Alphabet, RotorSettings, Bigrams, Trigrams, Quadgrams } = require('./constants.js')
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
          else if (max.score >= scoringMethod.maxScore && ciphertext.length > 50) {
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
        console.log(`Finished rotor set.\nConfiguration: ${max.rotors[0].type}-${max.rotors[0].pos}, ${max.rotors[1].type}-${max.rotors[1].pos}, ${max.rotors[2].type}-${max.rotors[2].pos}\nDecoded Text: ${max.decoded}\nScore: (${max.score})`)
      }
    }
  }
  return top3
}

process.on('message', (m) => {
  const {ciphertext, type} = m
  let top3
  if (type === 'ioc') {
    top3 = findMax(ciphertext, indexOfCoincidence)
  }
  else if (type === 'bigram') {
    top3 = findMax(ciphertext, bigramScore)
  }
  else if (type === 'trigram') {
    top3 = findMax(ciphertext, trigramScore)
  }
  else if (type === 'quadgram') {
    top3 = findMax(ciphertext, quadgramScore)
  }
  process.send({top3})
})