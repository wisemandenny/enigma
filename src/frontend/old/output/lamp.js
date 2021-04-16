import React from "react"
import Button from '@material-ui/core/Button'

const Lamp = (props) => {
  const {char, isLit } = props
  return (
    <Button variant={isLit ? 'contained' : 'outlined'} disabled>{char}</Button>
  )
}

export default Lamp