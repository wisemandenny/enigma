import React from 'react'
import Keyboard from './input/keyboard.js'
import LampBoard from './output/lampboard.js'

export default function Interface() {
  const [pressedKey, setPressedKey] = React.useState('!')
  return (
    <div>
      <LampBoard litLamp={pressedKey}/>
      <Keyboard setPressedKey={setPressedKey}/>
      <p>{pressedKey}</p>
    </div>
  )
}