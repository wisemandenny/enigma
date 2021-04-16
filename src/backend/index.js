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


const alphaToIndex = (char) => alphabet.indexOf(char)
const indexToAlpha = (index) => alphabet[index]
const numeralToIndex = (romanNumeral) => ['I', 'II', 'III', 'IV', 'V'].indexOf(romanNumeral)
const indexToNumeral = (index) => ['I', 'II', 'III', 'IV', 'V'][index]

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
  return alphabet[idx]
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

const indexOfCoincidence = (ciphertext) => {
  const N = ciphertext.length
  const c = 26
  const sums = alphabet.map((letter) => ([...ciphertext]).filter((cipherLetter) => cipherLetter === letter).length)

  const result = sums.reduce((acc, curr) => acc + ((curr / N) * (curr - 1) / (N-1)), 0)
  return result
}

const findMaxIOC = (ciphertext) => {
  // let top3 = new Array()
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
        let max = 0
        const maxSettings = {}
        // try each starting position
        for (let l = 0; l < 26; l++) {
          for (let m = 0; m < 26; m++) {
            for (let n = 0; n < 26; n++) {
              rotor0.position = n
              rotor1.position = m
              rotor2.position = l
              const encoded = encodeString(ciphertext, [rotor0, rotor1, rotor2])
              const encodedIOC = indexOfCoincidence(encoded.outputString)
              if (encodedIOC > max) {
                max = encodedIOC
                maxSettings.rotor0pos = n
                maxSettings.rotor1pos = m
                maxSettings.rotor2pos = l
              }
              // console.log('rotor0:', rotor0.type, rotor0.position, 'rotor1:', rotor1.type, rotor1.position, 'rotor2', rotor2.type, rotor2.position)
            }
          }
        }
        console.log(_i, _j, _k, JSON.stringify(maxSettings), max)
        
      }
    }
  }
  return top3
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


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

/* =========== ROUTES =========== */
app.post('/enigma/crack/ioc', (req, res) => {
  const { ciphertext } = req.body
  console.log("Cracking", ciphertext)
  const top3 = findMaxIOC(ciphertext)
  res.status(200).send(top3)

})

app.post('/enigma/crack/single_ioc', (req, res) => {
  const { ciphertext } = req.body
  const ioc = indexOfCoincidence(ciphertext)
  res.status(200).send({ioc})

})

app.post('/enigma/encode/single', (req, res) => {
  // rotors: [ {type: 'V', position: 2},  {type: 'I', position: 4}, {type: 'II', position: 12}]
  // input: 'A'
  const { rotors, input } = req.body
  const result = encodeSingle(rotors, input)
  res.send(result)
})

app.post('/enigma/encode/string', (req, res) => {
  const { input, rotors} = req.body
  const encoded = encodeString(input, rotors)
  
  res.send({...encoded})
})

app.listen(port, () => console.log(`Listening on port ${port}...`))


// ONTHEOTHERHANDWEDENOUNCEWITHRIGHTEOUSINDIGNATIONANDDISLIKEMENWHOARESOBEGUILEDANDDEMORALIZEDBYTHECHARMSOFPLEASUREOFTHEMOMENTSOBLINDEDBYDESIRETHATTHEYCANNOTFORESEETHEPAINANDTROUBLETHATAREBOUNDTOENSUEANDEQUALBLAMEBELONGSTOTHOSEWHOFAILINTHEIRDUTYTHROUGHWEAKNESSOFWILLWHICHISTHESAMEASSAYINGTHROUGHSHRINKINGFROMTOILANDPAINTHESECASESAREPERFECTLYSIMPLEANDEASYTODISTINGUISHINAFREEHOURWHENOURPOWEROFCHOICEISUNTRAMMELLEDANDWHENNOTHINGPREVENTSOURBEINGABLETODOWHATWELIKEBESTEVERYPLEASUREISTOBEWELCOMEDANDEVERYPAINAVOIDEDBUTINCERTAINCIRCUMSTANCESANDOWINGTOTHECLAIMSOFDUTYORTHEOBLIGATIONSOFBUSINESSITWILLFREQUENTLYOCCURTHATPLEASURESHAVETOBEREPUDIATEDANDANNOYANCESACCEPTEDTHEWISEMANTHEREFOREALWAYSHOLDSINTHESEMATTERSTOTHISPRINCIPLEOFSELECTIONHEREJECTSPLEASURESTOSECUREOTHERGREATERPLEASURESORELSEHEENDURESPAINSTOAVOIDWORSEPAINS (1:4 3:0 4:2)
//ZUPENFXQNTZIQQYMHIUVDGQVFZMVZZZAXWCBUAQQUCFRWQAGXAUAKOCZYTAWEAZBLORFXZLKDMTVUDRWGHOFYTYXHXZMWQDIASOAZZBTXJXSDCYWCOKQXBXEPWWHAPTPVABWQFSTZLILKQLHKAPPARGGHCWWNRFHNEKWGWRGLWLQUGNDHVLFTFJEXKMCEMAFQGGLRHFKLIDRTYPDTRQHCFEVQRLVORPMKUXMOMTPVFYRWCSCXUAQIBWZANPRDZCKBKWOKJCPUVLQRJKQXJHEPRBHOLPAIFYEVQZAZQIXAZRWZSUGYCAMTNVAXPWLBANZNVNJXJHKPYLAMVQCPNLZKWCTMBKLNJFHXOBVWQGNDPEJKUJYVTNQCBIDOACDRAHVPVYKWPYSWRNVZYERIIVBRUSIKRGFFFSYRSPEFPPRILCXQHPDRASLTGENOSBMVMMSKTAAQURCRIPVWLYVYBLSBPFQVTBZAFXXUADGXTLBOGUVNVNQTSFPMGCXWXZMIQBWALJCXPVPKELQOWXTEVQJLWLDKEUKIHLFSPSPWDDFUMBRJBIHAMXZEQNRLPBYLSSKHWBBNJUAKNUUSQGLZJGAASHSLRHYXQTRGUXEPLUIBSOEGCBUBEXWHMBTALWIQQHWFGMRGTGZTPVRTGNMXQNARJXBHWGULACDHDSDSDJFDAQIKJRGKTRFPTCCIVYZAWMVWAWYBBOXGUXRBFPXLTIMHAYVNRAHLEZRYLNJWORFGGBLEJYVBFYRZTVTMANTGUXEPLUIBVJVTZSJBRUMHYNZGWRGGHXHMGVBPHYZSCJZUA