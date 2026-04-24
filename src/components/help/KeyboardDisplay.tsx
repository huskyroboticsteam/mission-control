import {KeyboardReact} from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import './KeyboardDisplay.css'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectPressedKeys } from '../../store/inputSlice.js'

export const KeyboardDisplay = () => {
  const shifting = useSelector(selectPressedKeys).some((key) => key === 'SHIFT' || key === 'CAPSLOCK')

  return (
    <KeyboardReact
      layout={{
        default: [
          '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
          '{tab} q w e r t y u i o p [ ] \\',
          "{lock} a s d f g h j k l ; ' {enter}",
          '{shift} z x c v b n m , . / {shift}',
          '{space} {arrowleft} {arrowdown} {arrowup} {arrowright}',
        ],
        shift: [
          '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
          '{tab} Q W E R T Y U I O P { } |',
          '{lock} A S D F G H J K L : " {enter}',
          '{shift} Z X C V B N M < > ? {shift}',
          '{space} {arrowleft} {arrowdown} {arrowup} {arrowright}',
        ],
      }}
      display={{
        '{bksp}': '⌫',
        '{tab}': '⇥',
        '{lock}': 'Caps',
        '{enter}': '⏎',
        '{shift}': '⇧',
        '{space}': '␣',
        '{arrowup}': '↑',
        '{arrowdown}': '↓',
        '{arrowleft}': '←',
        '{arrowright}': '→',
      }}
      buttonTheme={[
        {
          class: 'space',
          buttons: '{space}',
        },
      ]}
      layoutName={shifting ? 'shift' : 'default'}
      useTouchEvents={true}
      physicalKeyboardHighlight={true}
      physicalKeyboardHighlightPress={true}
      keyboardDOMClass={'keyboard'}
    />
  )
}
