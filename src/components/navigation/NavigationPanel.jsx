import CameraStream from '../camera/CameraStream'
import Compass from './Compass'
import './NavigationPanel.css'
import WaypointNav from './WaypointNav'

async function fire() {
  const text = await fetch('http://0.0.0.0:8000/api/ubnt/sta')
  const json = await text.json()
  console.log(json)
}

function NavigationPanel() {
  return (
    <div className="navigation-panel">
      <CameraStream camera="mast" />
      <CameraStream camera="hand" />
      <Compass />
      <CameraStream camera="wrist" />
      <button onClick={fire}>hit me</button>
      <WaypointNav />
    </div>
  )
}

export default NavigationPanel
