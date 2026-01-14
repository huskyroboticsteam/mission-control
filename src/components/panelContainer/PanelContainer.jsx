import {Routes, Route, Navigate} from 'react-router-dom'
import TelemetryPanel from '../telemetry/TelemetryPanel'
import HelpPanel from '../help/HelpPanel'
import NavigationPanel from '../navigation/NavigationPanel'
import ArmDexterityPanel from '../armDexterity/ArmDexterityPanel'
import SciencePanel from '../science/SciencePanel'
import Calculator from '../navigation/Calculator'
import './PanelContainer.css'

function PanelContainer() {
  return (
    <div className="panel-container">
      <Routes>
        <Route path="" element={<Navigate to="/navigation" />} />

        <Route path="/navigation" element={<NavigationPanel />} />

        <Route path="/arm-dexterity" element={<ArmDexterityPanel />} />

        <Route path="/science" element={<SciencePanel />} />

        <Route path="/telemetry" element={<TelemetryPanel />} />

        <Route path="/calc" element={<Calculator />} />

        <Route path="/help" element={<HelpPanel />} />
      </Routes>
    </div>
  )
}

export default PanelContainer
