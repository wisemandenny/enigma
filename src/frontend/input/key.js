import React from "react"
import Button from '@material-ui/core/Button'

const Key = (props) => {
  const { char, onClick } = props
  return (
    <Button variant="outlined" onClick={onClick}>{char}</Button>
  )
}

export default Key