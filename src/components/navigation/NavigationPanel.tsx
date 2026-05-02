import React from 'react'
import CameraStream from '../camera/CameraStream.js'
import Compass from './Compass.js'
import './NavigationPanel.css'
import {WaypointList} from './WaypointList.js'
import {WaypointNav} from './WaypointNav.js'

export const NavigationPanel = () => {
  return (
    <div className="navigation-panel">
      <CameraStream camera="mast" />
      <CameraStream camera="hand" />
      <Compass />
      <CameraStream camera="wrist" />
      <WaypointList />
      <WaypointNav />
    </div>
  )
}
