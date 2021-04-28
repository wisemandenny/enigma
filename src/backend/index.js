const { Alphabet, RotorSettings, Reflector, Bigrams, Trigrams, Quadgrams } = require('./constants.js')
const { alphaToIndex, indexToAlpha, indexToNumeral, transform, inverseTransform, shiftRight } = require('./utils.js')
const { setupRotors, rotateAll, rotate, encodeSingle, encodeString } = require('./enigma.js')
const cp = require('child_process')
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



// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

/* =========== ROUTES =========== */
// Cracks the enigma code with the IOC method for ciphertext-only attack
app.post('/enigma/crack/ioc', sanitizeInput, (req, res) => {
  const { ciphertext } = req
  console.log(`Cracking method: index of coincidence \nCiphertext: ${ciphertext}.\n`)
  const iocChild = cp.fork(__dirname + '/decoderWorker')
  iocChild.on('message', (m) => {
    iocChild.kill()
    res.status(200).send(m.top3)
  })
  iocChild.send({ciphertext, type: 'ioc'})
  // const top3 = findMax(ciphertext, indexOfCoincidence)
  // res.status(200).send(top3)
})

// Cracks the enigma code with bigram score method for ciphertext-only attack
app.post('/enigma/crack/bigram', sanitizeInput, (req, res) => {
  const { ciphertext } = req
  console.log(`Cracking method: bigram scoring \nCiphertext: ${ciphertext}\n`)
  const bigramChild = cp.fork(__dirname + '/decoderWorker')
  bigramChild.on('message', (m) => {
    bigramChild.kill()
    res.status(200).send(m.top3)
  })
  bigramChild.send({ciphertext, type: 'bigram'})
})

app.post('/enigma/crack/trigram', sanitizeInput, (req, res) => {
  const { ciphertext } = req
  console.log(`Cracking method: trigram scoring \nCiphertext: ${ciphertext}.\n`)
  const trigramChild = cp.fork(__dirname + '/decoderWorker')
  trigramChild.on('message', (m) => {
    trigramChild.kill()
    res.status(200).send(m.top3)
  })
  trigramChild.send({ciphertext, type: 'trigram'})
})

app.post('/enigma/crack/quadgram', sanitizeInput, (req, res) => {
  const { ciphertext } = req
  console.log(`Cracking method: quadgram scoring \nCiphertext: ${ciphertext}.\n`)
  const quadgramChild = cp.fork(__dirname + '/decoderWorker')
  quadgramChild.on('message', (m) => {
    quadgramChild.kill()
    res.status(200).send(m.top3)
  })
  quadgramChild.send({ciphertext, type: 'quadgram'})
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

