import {useSelector} from 'react-redux'
import {Keyboard as KeyboardIcon, SportsEsports as GamepadIcon} from '@mui/icons-material'
import {selectInputDeviceIsConnected} from '../../store/inputSlice.js'
import {selectMountedPeripheral} from '../../store/peripheralSlice.js'
import './InputInfo.css'
import React from 'react'
import {camelCaseToTitle} from '../../util/camelCaseToTitle.js'

export const InputInfo = () => {
  const driveGamepadIsConnected = useSelector(selectInputDeviceIsConnected('driveGamepad'))
  const peripheralGamepadIsConnected = useSelector(
    selectInputDeviceIsConnected('peripheralGamepad')
  )

  const mountedPeripheral = useSelector(selectMountedPeripheral)

  return (
    <div className="input-info">
      <KeyboardInfo />
      <GamepadInfo label="Driver" connected={driveGamepadIsConnected} />
      <GamepadInfo
        label={mountedPeripheral ? mountedPeripheral : 'Peripheral'}
        connected={peripheralGamepadIsConnected}
      />
    </div>
  )
}

const KeyboardInfo = () => {
  const className = 'input-info__info input-info__info--connected'
  return (
    <div className={className}>
      <KeyboardIcon fontSize="large" className={className} />
      <p>Keyboard Controls</p>
    </div>
  )
}

const GamepadInfo = ({label, connected}: {label: string; connected: boolean}) => {
  const className =
    'input-info__info ' +
    (connected ? 'input-info__info--connected' : 'input-info__info--disconnected')

  return (
    <div className={className}>
      <GamepadIcon fontSize="large" className={className} />
      <p>{camelCaseToTitle(label) + ' Gamepad'}</p>
    </div>
  )
}
