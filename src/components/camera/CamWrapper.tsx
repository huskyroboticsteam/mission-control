import React, {useState} from 'react'
import {CameraStream} from './CameraStream.js'
import type {CameraNames} from '../../constants/cameraConstants.js'

function CamWrapper() {
  const [selectedCam, setSelectedCam] = useState<keyof typeof CameraNames>('mast')
  return (
    <div className="camwrapper" style={{width: '100%', height: '100%'}}>
      <CameraStream camera={selectedCam} />
      <div style={{position: 'relative', bottom: '10%', zIndex: 1000}}>
        <select
          style={{height: '100%'}}
          value={selectedCam}
          onChange={(e) => setSelectedCam(e.target.value as keyof typeof CameraNames)}>
          <option value="mast">mast</option>
          <option value="hand">hand</option>
          <option value="wrist">wrist</option>
        </select>
      </div>
    </div>
  )
}

export default CamWrapper
