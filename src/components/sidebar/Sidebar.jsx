import Navbar from './Navbar'
import EmergencyStopButton from './EmergencyStopButton'
import EnableMotorsButton from './EnableMotorsButton'
import ToggleInverseKinematics from './ToggleInverseKinematics'
import InputInfo from './InputInfo'
import ConnectionInfo from './ConnectionInfo'
import './Sidebar.css'

function Sidebar() {
  return (
    <div className="sidebar">
      <Navbar />
      <EmergencyStopButton />
      <EnableMotorsButton />
      <ToggleInverseKinematics />
      <InputInfo />
      <ConnectionInfo />
    </div>
  )
}

export default Sidebar
