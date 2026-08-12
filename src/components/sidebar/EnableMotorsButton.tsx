import {useDispatch, useSelector} from 'react-redux'
import {selectMotorsAreEnabled, enableMotors} from '../../store/motorSlice.js'
import './EnableMotorsButton.css'
import React from 'react'
import type {RoverDispatch} from '../../store/store.js'

export const EnableMotorsButton = () => {
  const dispatch = useDispatch<RoverDispatch>()
  const motorsEnabled = useSelector(selectMotorsAreEnabled)

  const handleClick = () => {
    dispatch(enableMotors({enabled: !motorsEnabled}))
  }

  const className =
    'enable-motors-button enable-motors-button--' + (motorsEnabled ? 'enabled' : 'disabled')
  const text = motorsEnabled ? 'Motors Enabled' : 'Motors Disabled'

  return (
    <div className={className}>
      <button onClick={handleClick}>{text}</button>
    </div>
  )
}
