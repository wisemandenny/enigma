import React from 'react'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import './keyboard.css'



const MyKeyboard = (props) => {
  const onChange = (input) => console.log("Input changed", input)
  const onKeyPress = (button) => console.log("Button pressed", button)

  const layout = {
    default: [
      'Q W E R T Y U I O P {bksp}',
      'A S D F G H J K L',
      'Z X C V B N M'
    ]
    }
  return (
    <Keyboard 
    layout={layout} 
    onChange={onChange} 
    onKeyPress={onKeyPress}
    theme={"hg-theme-default hg-layout-default myTheme"}
    />
  )
}

export default MyKeyboard