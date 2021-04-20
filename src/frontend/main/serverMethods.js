const prefix = 'http://localhost:3001/enigma'

const postEncodeString = (req) => {
  return fetch(`${prefix}/encode/string`, {
    method: 'POST',
    body: JSON.stringify(req),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
}

const postEncodeSingle = (req) => {
  return fetch(`${prefix}/encode/single`, {
    method: 'POST',
    body: JSON.stringify(req),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
  .then((res) => res.json())
  .then((res) => res)
}

const postCrack = (req) => {
  return fetch(`${prefix}/crack/${req.type}`, {
    method: 'POST',
    body: JSON.stringify({ciphertext: req.inputText}),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
  .then((res) => res.json())
  .then((res) => res)
}

export { postEncodeString, postCrack, postEncodeSingle }