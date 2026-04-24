import CameraStream from '../camera/CameraStream'
import Compass from './Compass'
import './NavigationPanel.css'
import OpModeSelect from './OpModeSelect'
import WaypointList from './WaypointList'
import WaypointNav from './WaypointNav'
import {useState} from 'react'

function NavigationPanel() {
  const [camMode, setCamMode] = useState('all')
  console.log(camMode)

  const handleChange = (event) => {
    setCamMode(event.target.value)
    console.log(event.target.value)
  }

  return (
    <div className="navigation-panel">
      <select className="dropdown" onClick={handleChange}>
        <option value="all">All Cameras</option>
        <option value="mast">Mast Camera</option>
        <option value="hand">Hand Camera</option>
        <option value="wrist">Wrist Camera</option>
      </select>
      <div className="cameras">
        {camMode === 'mast' && <CameraStream camera="mast" />}
        {camMode === 'hand' && <CameraStream camera="hand" />}
        {camMode === 'wrist' && <CameraStream camera="wrist" />}
        {camMode === 'all' && (
          <>
            <CameraStream camera="mast" />
            <CameraStream camera="hand" />
            <CameraStream camera="wrist" />
          </>
        )}
      </div>

      <div className="compassAndWaypoint">
        <Compass />
        <WaypointList />
        <WaypointNav />
      </div>
    </div>
  )
}

export default NavigationPanel
