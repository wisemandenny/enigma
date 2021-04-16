import React from 'react'
import MyKeyboard from './keyboard.js'
import Lamps from './lamps.js'
import './index.css'

export default function EnigmaSim() {
  //vertical flex
    //lamps
    // horizontal flex
      // 3 x sideways rotors 1 x reflector
        // wires connecting
    // horizontal flex
      // keyboard
      // vertical flex
        // horizontal flex
          // 3 x rotor settings wheel
        // select rotors button
  
  return (
    <div className="root">
      <div className="lamps">
        <Lamps />
      </div>
      <div className="rotors"></div>
      <div className="input">
        <MyKeyboard />
        <div className="settings">
          <div className="rotorSettings"></div>
          <div className="selectRotors"></div>
        </div>
      </div>
    </div>
  )
}