import React, {useEffect} from 'react'
import {fabric} from 'fabric'

const RotorArea = (props) => {
  const {rotors} = props

  useEffect(() => {
    const canvas = new fabric.StaticCanvas('rotor-canvas')
    rotors.map((rotor) => {
      
    })
  })

  return (
    <canvas
      id = 'rotor-canvas'
      width='100%'
      height='100%' />
  )
}

export default RotorArea