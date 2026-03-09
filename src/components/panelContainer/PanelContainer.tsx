import {Routes, Route, Navigate} from 'react-router-dom'
import {TelemetryPanel} from '../telemetry/TelemetryPanel.js'
// import {HelpPanel} from '../help/HelpPanel.js'
// import {NavigationPanel} from '../navigation/NavigationPanel.js'
import {ArmDexterityPanel} from '../armDexterity/ArmDexterityPanel.js'
import './PanelContainer.css'
import React from 'react'

function PanelContainer() {
  return (
    <div className="panel-container">
      <Routes>
        <Route path="" element={<Navigate to="/navigation" />} />

        {/* <Route path="/navigation" element={<NavigationPanel />} /> */}

        <Route path="/arm-dexterity" element={<ArmDexterityPanel />} />

        <Route path="/telemetry" element={<TelemetryPanel />} />

        {/* <Route path="/help" element={<HelpPanel />} /> */}
      </Routes>
    </div>
  )
}

export default PanelContainer
