import {useEffect} from 'react'
import {RoverSocketManager} from '../networking/RoverSocketManager.js'
import {GamepadController} from '../input/GamepadController.js'
import {KeyboardController} from '../input/KeyboardController.js'
import {Sidebar} from '../sidebar/Sidebar.js'
import PanelContainer from '../panelContainer/PanelContainer.js'
import './App.css'
import React from 'react'

export const App = () => {
  // Disable context menu.
  useEffect(() => {
    const handleContextMenu = (event: PointerEvent) => event.preventDefault()
    document.addEventListener('contextmenu', handleContextMenu)
  }, [])

  return (
    <div className="app">
      <RoverSocketManager />
      <GamepadController gamepadName="driveGamepad" gamepadIndex={0} />
      <GamepadController gamepadName="peripheralGamepad" gamepadIndex={1} />
      <KeyboardController />
      <Sidebar />
      <PanelContainer />
    </div>
  )
}
