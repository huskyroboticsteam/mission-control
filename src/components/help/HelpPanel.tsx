import './HelpPanel.css'
import {GamepadTable} from './GamepadTable.js'
import {useEffect} from 'react'
import React, {useState} from 'react'
import {
  Axes,
  Buttons,
  gamepadApiWrapper,
  GamepadIndex,
  GamepadNames,
  Gamepads,
} from '../../constants/gamepadConstants.js'
import {Gamepad} from './Gamepad.js'
import {useStore} from 'react-redux'
import type {RootState} from '../../store/store.js'
import {gamepadAxisChanged, gamepadButtonChanged} from '../../store/inputSlice.js'
import {KeyboardTable} from './KeyboardTable.js'
import {KeyboardDisplay} from './KeyboardDisplay.js'
import {processCustomizationPanelData} from '../../util/processCustomizationPanelData.js'
import CustomizationPanel from '../armDexterity/CustomizationPanel.js'

export const HelpPanel = () => {
  const store = useStore<RootState>()
  const defaultSettings = [2, 2]
  const components = ['driveGP', 'peripheralGP', 'keyboard']
  const [rowNum, setRowNum] = React.useState(defaultSettings[0])
  const [colNum, setColNum] = React.useState(defaultSettings[1])
  const [coordinates, setCoordinates] = useState([[[0, 0]], [[0, 1]], [[1, 0]]])
  const [edit, setEdit] = useState(false)

  const handleChildData = (data: (number | null)[][]) => {
    const processedData = processCustomizationPanelData(data, components)
    setCoordinates(processedData.coordinates)
    setRowNum(processedData.rowNum)
    setColNum(processedData.colNum)
    setEdit(false)
  }

  // Adds listener for gamepad button changes + updates buttonChange state accordingly
  useEffect(() => {
    if (!gamepadApiWrapper) return

    const unsubscribeButtons = gamepadApiWrapper.onGamepadButtonChange(
      (gpadIndex, _, buttonChanges) => {
        buttonChanges.forEach((change, index) => {
          if (change) {
            if (change.pressed || change.released) {
              store.dispatch(
                gamepadButtonChanged({
                  gamepadName: Gamepads[gpadIndex],
                  buttonName: Buttons[index],
                  pressed: change.pressed ?? false,
                })
              )
            }
          }
        })
      }
    )

    const unsubscribeAxes = gamepadApiWrapper.onGamepadAxisChange(
      (gpadIndex, gpad, axisChanges) => {
        axisChanges.forEach((value, index) => {
          if (value) {
            store.dispatch(
              gamepadAxisChanged({
                gamepadName: Gamepads[gpadIndex],
                axisName: Axes[index],
                value: gpad.axes[index],
              })
            )
          }
        })
      }
    )

    // stops listening when unmounted
    return () => {
      unsubscribeButtons
      unsubscribeAxes
    }
  }, [])

  return (
    <div
      id="help-panel"
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rowNum}, 1fr)`,
        gridTemplateColumns: `repeat(${colNum}, 1fr)`,
      }}>
      {coordinates[0]?.length > 0 &&
        coordinates[0].map((coord) => (
          <div className= "drive-gpad" style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <GamepadTable gamepadName={GamepadNames.driveGamepad} />
            <div className="g1-text-wrapper">
              <b className="label">Driver Gamepad</b>
              <Gamepad index={GamepadIndex.driveGamepad} />
            </div>
          </div>
        ))}
      {coordinates[1]?.length > 0 &&
        coordinates[1].map((coord) => (
          <div className= "peripheral-gpad" style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <GamepadTable gamepadName={GamepadNames.peripheralGamepad} />
            <div className="g2-text-wrapper">
              <b className="label">Peripheral Gamepad</b>
              <Gamepad index={GamepadIndex.peripheralGamepad} />
            </div>
          </div>
        ))}
      {coordinates[2]?.length > 0 &&
        coordinates[2].map((coord) => (
          <div className= "keyboard-container"style={{gridColumn: `${coord[1] + 1}/-1`, gridRow: `${coord[0] + 1}`}}>
            <KeyboardTable />
            <div className="keyboard">
              <b className="label">Keyboard Controls</b>
              <KeyboardDisplay />
            </div>
          </div>
        ))}
      <div
        className="customization-container"
        style={{position: 'absolute', bottom: 0, right: 0, zIndex: 1000}}>
        <CustomizationPanel
          onSend={handleChildData}
          components={components}
          edit={edit}
          defaultSettings={defaultSettings}
        />
      </div>
      {!edit && (
        <button
          onClick={() => setEdit(true)}
          style={{position: 'absolute', bottom: 0, right: 0, zIndex: 999}}>
          {' '}
          Edit Layout
        </button>
      )}
    </div>
  )
}
