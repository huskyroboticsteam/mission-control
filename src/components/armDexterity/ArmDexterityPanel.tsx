import React from 'react'
import {CameraStream} from '../camera/CameraStream.js'
//import processCustomizationPanelData from '../../util/processCustomizationPanelData.ts'

import './ArmDexterityPanel.css'

export const ArmDexterityPanel = () => {
  return (
    <div className="arm-dexterity-panel">
      <CameraStream camera="hand" />
      <CameraStream camera="wrist" />
    </div>
  )
}
