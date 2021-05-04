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
    .then((json) => json)
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
  .then((json) => json)
}

const postDeleteSingle = (req) => {
  return fetch(`${prefix}/encode/deleteSingle`, {
    method: 'POST',
    body: JSON.stringify(req),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
  .then((res) => res.json())
  .then((json) => json)
 
}

const postCrack = (req) => {
  return fetch(`${prefix}/crack/${req.type}`, {
    method: 'POST',
    body: JSON.stringify({ciphertext: req.inputText, id: req.id}),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
  .then((res) => res.json())
  .then((json) => json)
}

const cancelCrack = (req) => {
  return fetch(`${prefix}/crack/cancel/${req.id}`, {
    method: 'DELETE'
  })
  .then(() => {})
}

export { postEncodeString, postCrack, postEncodeSingle, postDeleteSingle, cancelCrack }