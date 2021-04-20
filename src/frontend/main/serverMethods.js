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

const postCrack = (req) => {
  console.log(req)
  return fetch(`${prefix}/crack/${req.type}`, {
    method: 'POST',
    body: JSON.stringify({ciphertext: req.inputText}),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
  .then((res) => res.json())
  .then((res) => res[2])
}
export {postEncodeString, postCrack}