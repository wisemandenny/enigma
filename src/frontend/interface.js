import React from 'react'
import Keyboard from './input/keyboard.js'
import RotorInit from './input/rotorInit.js'
import LampBoard from './output/lampboard.js'
import Rotors from './internals/rotors.js'

export default function Interface() {
  const [pressedKey, setPressedKey] = React.useState(['!', true])
  const [rotorPositions, setRotorPositions] = React.useState([0,0,0])
  const [rotorOutputKey, setRotorOutputKey] = React.useState(['!', false])

  // console.log(rotorOutputKey[0])
  return (
    <div>
      <LampBoard litLamp={rotorOutputKey ? rotorOutputKey[0] : ''}/>
      <Rotors pressedKey={pressedKey} rotorPositions={rotorPositions} setRotorPositions={setRotorPositions} types={['I', 'II', 'III']} setRotorOutputKey={setRotorOutputKey}/>
      <Keyboard setPressedKey={setPressedKey} dupKeyToggle={pressedKey[1]}/>
      <RotorInit rotorPositions={rotorPositions} setRotorPositions={setRotorPositions}/>
      <p>{pressedKey}</p>
    </div>
  )
}