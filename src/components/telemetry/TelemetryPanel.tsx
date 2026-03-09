import React from 'react'
import {JointTelemetry} from './JointTelemetry.js'
import './TelemetryPanel.css'

export const TelemetryPanel = () => {
  return (
    <div className="telemetry-panel">
      <JointTelemetry />
    </div>
  )
}
