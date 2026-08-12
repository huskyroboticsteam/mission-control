import React from 'react'
import {CameraStream} from '../camera/CameraStream.js'

import './ArmDexterityPanel.css'

export const ArmDexterityPanel = () => {
  return (
    <div className="arm-dexterity-panel">
      <CameraStream camera="mast" />
      <CameraStream camera="hand" />
      <CameraStream camera="wrist" />
    </div>
  )
}
