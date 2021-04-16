import React, {useEffect} from 'react'
import {fabric} from 'fabric'

const Lamps = (props) => {
  const {litLetter} = props

  useEffect(() => {
    const canvas = new fabric.StaticCanvas('lamp-canvas')
    const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']
    rows.map((row, y) => {
      [...row].map((char, x) => {
        const circle =  new fabric.Circle({
          radius: 20,
          // left: 30*y + x * 40,
          // top: (y * 40),
          fill: litLetter===char ? 'yellow' : '#eef',
          originX: 'center',
          originY: 'center'
        })
        const label = new fabric.Text(char, {
          fontFamily: 'Calibri',
          fontsize: 6,
          textAlign: 'center',
          originX: 'center',
          originY: 'center'
        })
        const lamp = new fabric.Group([circle, label], {
          left: 30 * y + x * 40,
          top: (y * 40),
          // attributes go here
        })
        canvas.add(lamp)
      })
    })
  }, [litLetter])

  return (
    <canvas
      id='lamp-canvas'
      width='400'
      height='300'
    />
  )
}

export default Lamps