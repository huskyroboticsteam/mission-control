import {useEffect, useState} from 'react'

// Table for Gamepad Controls
function Table({gpadButton, gpadAxis, gpadIndex, tankDriveEnabled, setTankDriveEnabled}) {
  const [arrButton, setArrButton] = useState(new Array(17).fill(0))
  const [arrAxis, setArrAxis] = useState(new Array(4).fill(0))
  const arrControls = new Array(18).fill(' ')
  if (gpadIndex == 0) {
    arrControls[3] = 'Switch to Tank Mode'
    arrControls[4] = 'Reduce Speed (0.3)'
    arrControls[5] = 'Reduce Speed (0.3)'
    arrControls[10] = 'Forward/Backward'
    arrControls[11] = 'Steer'
    //setLabel("Drive Gamepad");
  } else if (gpadIndex == 1) {
    arrControls[2] = 'Hand Actuator'
    arrControls[3] = 'Hand Actuator'
    arrControls[6] = 'Open Hand'
    arrControls[7] = 'Close Hand'
    arrControls[10] = 'X: ArmBase, Y: Shoulder/IK forward'
    arrControls[11] = 'X: Forearm, Y: Elbow/IK up'
    arrControls[12] = 'Wrist Pitch'
    arrControls[13] = 'Wrist Pitch'
    arrControls[14] = 'Wrist Roll'
    arrControls[15] = 'Wrist Roll'
    //setLabel("Arm Gamepad");
  }
  const [controls, setControls] = useState(arrControls)

  useEffect(() => {
    if (gpadIndex == 0) {
      let arr = new Array(18).fill(' ')
      if (tankDriveEnabled) {
        arr[3] = 'Switch to DRIVE mode'
        arr[10] = 'Left Stick Y: Left Track'
        arr[11] = 'Right Stick Y: Right Track'
        setControls(arr)
        //setLabel("Tank Gamepad");
      } else {
        arr[3] = 'Switch to TANK mode'
        arr[4] = 'Reduce Speed (0.3)'
        arr[5] = 'Reduce Speed (0.3)'
        arr[10] = 'Forward/Backward'
        arr[11] = 'Steer'
        setControls(arr)
        //setLabel("Drive Gamepad");
      }
    }
  }, [tankDriveEnabled])

  useEffect(() => {
    console.log(gpadButton)
    for (let i = 0; i < 17; i++) {
      if (!gpadButton?.buttons[i] || gpadButton?.index !== gpadIndex) continue

      if (i == 3 && gpadButton?.index == 0 && gpadButton?.buttons[3].pressed) {
        setTankDriveEnabled((prev) => !prev)
      }
      setArrButton((prevArr) => {
        const newArr = [...prevArr]
        newArr[i] = Math.round(gpadButton.buttons[i].value * 100) / 100
        return newArr
      })
    }
  }, [gpadButton?.buttons])

  useEffect(() => {
    console.log(gpadAxis)
    if (gpadAxis?.index == gpadIndex) {
      for (let i = 0; i < 4; i++) {
        if (
          !gpadAxis?.axes[i] ||
          (gpadAxis?.axes[i] <= 0.1 && gpadAxis?.axes[i] >= 0) ||
          (gpadAxis?.axes[i] >= -0.1 && gpadAxis?.axes[i] <= 0)
        ) {
          //threshold so that on actual controller goes back to 0
          setArrAxis((prevArr) => {
            const newArr = [...prevArr]
            newArr[i] = 0
            return newArr
          })
        } else if (gpadAxis?.index == gpadIndex) {
          setArrAxis((prevArr) => {
            const newArr = [...prevArr]
            newArr[i] = Math.round(gpadAxis.axes[i] * 100) / 100
            return newArr
          })
        }
      }
    }
  }, [gpadAxis?.axes])

  return (
    <div className="drive-gpad-table">
      <table>
        <tbody className="axis-table">
          <tr>
            <th>Axis</th>
            <td>Left X</td>
            <td>Left Y</td>
            <td>Right X</td>
            <td>Right Y</td>
          </tr>
          <tr>
            <th>Value</th>
            <td style={{backgroundColor: arrAxis[0] != 0 ? 'yellow' : 'white'}}>{arrAxis[0]}</td>
            <td style={{backgroundColor: arrAxis[1] != 0 ? 'yellow' : 'white'}}>{arrAxis[1]}</td>
            <td style={{backgroundColor: arrAxis[2] != 0 ? 'yellow' : 'white'}}>{arrAxis[2]}</td>
            <td style={{backgroundColor: arrAxis[3] != 0 ? 'yellow' : 'white'}}>{arrAxis[3]}</td>
          </tr>
        </tbody>
      </table>

      <div className="buttons">
        <table>
          <thead>
            <tr>
              <th>Button</th>
              <th>Action</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody className="button-table">
            <tr style={{backgroundColor: arrButton[0] > 0 ? 'yellow' : 'white'}}>
              <td>A / x</td>
              <td>{controls[0]}</td>
              <td>{arrButton[0]}</td>
            </tr>
            <tr style={{backgroundColor: arrButton[1] > 0 ? 'yellow' : 'white'}}>
              <td>B / ◯</td>
              <td>{controls[1]}</td>
              <td>{arrButton[1]}</td>
            </tr>
            <tr style={{backgroundColor: arrButton[2] > 0 ? 'yellow' : 'white'}}>
              <td>X / ▢</td>
              <td>{controls[2]}</td>
              <td>{arrButton[2]}</td>
            </tr>
            <tr style={{backgroundColor: arrButton[3] > 0 ? 'yellow' : 'white'}}>
              <td>Y / △</td>
              <td>{controls[3]}</td>
              <td>{arrButton[3]}</td>
            </tr>
            <tr style={{backgroundColor: arrButton[4] > 0 ? 'yellow' : 'white'}}>
              <td>Left Button</td>
              <td>{controls[4]}</td>
              <td>{arrButton[4]}</td>
            </tr>
            <tr style={{backgroundColor: arrButton[5] > 0 ? 'yellow' : 'white'}}>
              <td>Right Button</td>
              <td>{controls[5]}</td>
              <td>{arrButton[5]}</td>
            </tr>
            <tr style={{backgroundColor: arrButton[6] > 0 ? 'yellow' : 'white'}}>
              <td>Left Trigger</td>
              <td>{controls[6]}</td>
              <td>{arrButton[6]}</td>
            </tr>
            <tr style={{backgroundColor: arrButton[7] > 0 ? 'yellow' : 'white'}}>
              <td>Right Trigger</td>
              <td>{controls[7]}</td>
              <td>{arrButton[7]}</td>
            </tr>
            <tr style={{backgroundColor: arrButton[8] > 0 ? 'yellow' : 'white'}}>
              <td>Select</td>
              <td>{controls[8]}</td>
              <td>{arrButton[8]}</td>
            </tr>
            <tr style={{backgroundColor: arrButton[9] > 0 ? 'yellow' : 'white'}}>
              <td>Start</td>
              <td>{controls[9]}</td>
              <td>{arrButton[9]}</td>
            </tr>
            <tr
              style={{
                backgroundColor:
                  arrButton[10] > 0 || arrAxis[0] != 0 || arrAxis[1] != 0 ? 'yellow' : 'white',
              }}>
              <td>Left Joystick</td>
              <td>{controls[10]}</td>
              <td>{arrButton[10]}</td>
            </tr>
            <tr
              style={{
                backgroundColor:
                  arrButton[11] > 0 || arrAxis[2] != 0 || arrAxis[3] != 0 ? 'yellow' : 'white',
              }}>
              <td>Right Joystick</td>
              <td>{controls[11]}</td>
              <td>{arrButton[11]}</td>
            </tr>
            <tr style={{backgroundColor: arrButton[12] > 0 ? 'yellow' : 'white'}}>
              <td>D-Pad up</td>
              <td>{controls[12]}</td>
              <td>{arrButton[12]}</td>
            </tr>
            <tr style={{backgroundColor: arrButton[13] > 0 ? 'yellow' : 'white'}}>
              <td>D-Pad down</td>
              <td>{controls[13]}</td>
              <td>{arrButton[13]}</td>
            </tr>
            <tr style={{backgroundColor: arrButton[14] > 0 ? 'yellow' : 'white'}}>
              <td>D-Pad left</td>
              <td>{controls[14]}</td>
              <td>{arrButton[14]}</td>
            </tr>
            <tr style={{backgroundColor: arrButton[15] > 0 ? 'yellow' : 'white'}}>
              <td>D-Pad right</td>
              <td>{controls[15]}</td>
              <td>{arrButton[15]}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table
