import Keyboard from 'react-simple-keyboard'
import {useState, useEffect} from 'react'
import 'react-simple-keyboard/build/css/index.css'
import './KeyboardNew.css'

function KeyboardNew() {
  const [layoutName, setLayoutName] = useState('default')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        setLayoutName('shift')
      } else if (e.key === 'CapsLock') {
        setLayoutName((prev) => (prev === 'default' ? 'shift' : 'default'))
      }
    }

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        setLayoutName('default')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const onKeyPress = (button) => {
    console.log('Button pressed', button)
  }

  return (
    <Keyboard
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
          '{shift} Z X C V B N M < > {shift}',
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
      layoutName={layoutName}
      useTouchEvents={true}
      onKeyPress={onKeyPress}
      physicalKeyboardHighlight={true}
      physicalKeyboardHighlightPress={true}
    />
  )
}

export default KeyboardNew
