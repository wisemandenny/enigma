import React from 'react'
import Keyboard from './input/keyboard.js'
import LampBoard from './output/lampboard.js'
import Rotors from './internals/rotors.js'

export default function Interface() {
  const [pressedKey, setPressedKey] = React.useState(['!', true])
  const [rotorPositions, setRotorPositions] = React.useState([0,0,0])

  return (
    <div>
      <LampBoard litLamp={pressedKey[0]}/>
      <Rotors pressedKey={pressedKey} rotorPositions={rotorPositions} setRotorPositions={setRotorPositions} types={['I', 'II', 'III']}/>
      <Keyboard setPressedKey={setPressedKey} dupKeyToggle={pressedKey[1]}/>
      <p>{pressedKey}</p>
    </div>
  )
}