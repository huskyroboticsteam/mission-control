import React from 'react'
import {useState, useEffect} from 'react'

// Table for Keyboard Controls
function KeyboardTable() {
  // tracks whether each key is pressed (1) or not (0)
  // 18 total keys that are linked to actions
  const [keys, setKeys] = useState(new Array(18).fill(0))
  const keyMap = {
    ' ': 0, // Space
    ArrowUp: 1,
    ArrowDown: 2,
    ArrowLeft: 3,
    ArrowRight: 4,
    Shift: 5,

    y: 6,
    w: 7,
    a: 8,
    s: 9,
    d: 10,

    t: 11,
    g: 12,
    f: 13,
    h: 14,

    k: 15,
    i: 16,
    u: 17,
    o: 18,
  }
  // controls that change depending on drive/tank mode
  let arr = ['Forward', 'Backward', 'Left', 'Right', 'Switch to TANK mode']
  const [controls, setControls] = useState(arr)

  // Listens for keydown and keyup events, updates key state accordingly
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // console.log('Key Down:', event.key)
      if (event.key in keyMap) {
        setKeys((prevKeys) => {
          const newKeys = [...prevKeys]
          newKeys[keyMap[event.key as keyof typeof keyMap]] = 1
          return newKeys
        })
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      // console.log('Key Up:', event.key)
      if (event.key in keyMap) {
        setKeys((prevKeys) => {
          const newKeys = [...prevKeys]
          newKeys[keyMap[event.key as keyof typeof keyMap]] = 0
          return newKeys
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Updates controls based on drive/tank mode
  useEffect(() => {
    // if (tankDriveEnabled) {
    //   arr[0] = 'Right Side Forward'
    //   arr[1] = 'Left Side Backward'
    //   arr[2] = 'Left Side Forward'
    //   arr[3] = 'Right Side Backward'
    //   arr[4] = 'Switch to DRIVE mode'
    //   setControls(arr)
    // } else {
      arr[0] = 'Forward'
      arr[1] = 'Backward'
      arr[2] = 'Left'
      arr[3] = 'Right'
      arr[4] = 'Switch to TANK mode'
      setControls(arr)
    // }
  }, [])

  return (
    <div className="keyboard-table-container">
      <table className="table">
        <thead>
          <tr>
            <th className="th">Key</th>
            <th className="th">Action</th>
            <th className="th">Value</th>
          </tr>
        </thead>
        <tbody className="keyboard-table">
          <tr style={{backgroundColor: keys[0] > 0 ? 'yellow' : 'white'}}>
            <td>Space</td>
            <td>Toggle Emergency Stop</td>
            <td>{keys[0]}</td>
          </tr>
          <tr style={{backgroundColor: keys[1] > 0 ? 'yellow' : 'white'}}>
            <td>Up</td>
            <td>{controls[0]}</td>
            <td>{keys[1]}</td>
          </tr>
          <tr style={{backgroundColor: keys[2] > 0 ? 'yellow' : 'white'}}>
            <td>Down</td>
            <td>{controls[1]}</td>
            <td>{keys[2]}</td>
          </tr>
          <tr style={{backgroundColor: keys[3] > 0 ? 'yellow' : 'white'}}>
            <td>Left</td>
            <td>{controls[2]}</td>
            <td>{keys[3]}</td>
          </tr>
          <tr style={{backgroundColor: keys[4] > 0 ? 'yellow' : 'white'}}>
            <td>Right</td>
            <td>{controls[3]}</td>
            <td>{keys[4]}</td>
          </tr>
          <tr style={{backgroundColor: keys[5] > 0 ? 'yellow' : 'white'}}>
            <td>Shift</td>
            <td>Reduce Speed (0.2)</td>
            <td>{keys[5]}</td>
          </tr>
        </tbody>
      </table>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Key</th>
            <th className="th">Action</th>
            <th className="th">Value</th>
          </tr>
        </thead>
        <tbody className="keyboard-table">
          <tr style={{backgroundColor: keys[6] > 0 ? 'yellow' : 'white'}}>
            <td className="td">Y</td>
            <td className="td">{controls[4]}</td>
            <td className="td">{keys[6]}</td>
          </tr>
          <tr style={{backgroundColor: keys[7] > 0 ? 'yellow' : 'white'}}>
            <td className="td">W</td>
            <td className="td">Shoulder/IK Forward</td>
            <td className="td">{keys[7]}</td>
          </tr>
          <tr style={{backgroundColor: keys[8] > 0 ? 'yellow' : 'white'}}>
            <td className="td">A</td>
            <td className="td">Rotate Arm Base Counterclockwise</td>
            <td className="td">{keys[8]}</td>
          </tr>
          <tr style={{backgroundColor: keys[9] > 0 ? 'yellow' : 'white'}}>
            <td className="td">S</td>
            <td className="td">Shoulder/IK Backward</td>
            <td className="td">{keys[9]}</td>
          </tr>
          <tr style={{backgroundColor: keys[10] > 0 ? 'yellow' : 'white'}}>
            <td className="td">D</td>
            <td className="td">Rotate Arm Base Clockwise</td>
            <td className="td">{keys[10]}</td>
          </tr>
          <tr style={{backgroundColor: keys[11] > 0 ? 'yellow' : 'white'}}>
            <td className="td">T</td>
            <td className="td">Elbow Up</td>
            <td className="td">{keys[11]}</td>
          </tr>
          <tr style={{backgroundColor: keys[12] > 0 ? 'yellow' : 'white'}}>
            <td className="td">G</td>
            <td className="td">Elbow Down</td>
            <td className="td">{keys[12]}</td>
          </tr>
          <tr style={{backgroundColor: keys[13] > 0 ? 'yellow' : 'white'}}>
            <td className="td">F</td>
            <td className="td">Rotate Forearm Clockwise</td>
            <td className="td">{keys[13]}</td>
          </tr>
          <tr style={{backgroundColor: keys[14] > 0 ? 'yellow' : 'white'}}>
            <td className="td">H</td>
            <td className="td">Rotate Forearm Counterclockwise</td>
            <td className="td">{keys[14]}</td>
          </tr>
          <tr style={{backgroundColor: keys[15] > 0 ? 'yellow' : 'white'}}>
            <td className="td">K</td>
            <td className="td">Wrist Pitch</td>
            <td className="td">{keys[15]}</td>
          </tr>
          <tr style={{backgroundColor: keys[16] > 0 ? 'yellow' : 'white'}}>
            <td className="td">I</td>
            <td className="td">Wrist Pitch</td>
            <td className="td">{keys[16]}</td>
          </tr>
          <tr style={{backgroundColor: keys[17] > 0 ? 'yellow' : 'white'}}>
            <td className="td">U</td>
            <td className="td">Wrist Roll</td>
            <td className="td">{keys[17]}</td>
          </tr>
          <tr style={{backgroundColor: keys[18] > 0 ? 'yellow' : 'white'}}>
            <td className="td">O</td>
            <td className="td">Wrist Roll</td>
            <td className="td">{keys[18]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default KeyboardTable
