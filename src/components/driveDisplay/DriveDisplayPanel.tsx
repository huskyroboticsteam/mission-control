import React, {useEffect, useState} from 'react'
import {Wheel} from './Wheel.js'
import {RoverBody} from './RoverBody.js'

import './DriveDisplayPanel.css'

export const DriveDisplayPanel = () => {
  return (
    <div className="drive-display-panel">
      <RoverBody>
        <Wheel className="wheel-fl" steerDeg={0} spinRadPerSec={0} />
        <Wheel className="wheel-fr" steerDeg={0} spinRadPerSec={0} />
        <Wheel className="wheel-rl" steerDeg={0} spinRadPerSec={0} />
        <Wheel className="wheel-rr" steerDeg={0} spinRadPerSec={0} />
      </RoverBody>
    </div>
  )
}
