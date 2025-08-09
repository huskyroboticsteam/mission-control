import {NavLink} from 'react-router-dom'
import NavigationIcon from '@mui/icons-material/Map'
import ArmDexterityIcon from '@mui/icons-material/BackHand'
import ScienceIcon from '@mui/icons-material/Science'
import TelemetryIcon from '@mui/icons-material/Info'
import HelpIcon from '@mui/icons-material/Help'
import CalcIcon from '@mui/icons-material/Calculate'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/navigation" className={({isActive}) => (isActive ? 'active' : 'inactive')}>
            <NavigationIcon fontSize="large" className="navbar__icon" />
            Navigation
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/arm-dexterity"
            className={({isActive}) => (isActive ? 'active' : 'inactive')}>
            <ArmDexterityIcon fontSize="large" className="navbar__icon" />
            Arm Dexterity
          </NavLink>
        </li>

        <li>
          <NavLink to="/science" className={({isActive}) => (isActive ? 'active' : 'inactive')}>
            <ScienceIcon fontSize="large" className="navbar__icon" />
            Science
          </NavLink>
        </li>

        <li>
          <NavLink to="/telemetry" className={({isActive}) => (isActive ? 'active' : 'inactive')}>
            <TelemetryIcon fontSize="large" className="navbar__icon" />
            Telemetry
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/calc"
            className={({isActive}) => {
              isActive ? 'active' : 'inactive'
            }}>
            <CalcIcon fontSize="large" className="navbar__icon" />
            Calculate
          </NavLink>
        </li>

        <li>
          <NavLink to="/help" className={({isActive}) => (isActive ? 'active' : 'inactive')}>
            <HelpIcon fontSize="large" className="navbar__icon" />
            Help
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
