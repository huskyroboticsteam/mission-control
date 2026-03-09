import {NavLink} from 'react-router-dom'
import {
  Map as NavigationIcon,
  BackHand as ArmDexterityIcon,
  Science as ScienceIcon,
  Info as TelemetryIcon,
  Help as HelpIcon,
} from '@mui/icons-material'
import './Navbar.css'
import React from 'react'

export const Navbar = () => {
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
          <NavLink to="/telemetry" className={({isActive}) => (isActive ? 'active' : 'inactive')}>
            <TelemetryIcon fontSize="large" className="navbar__icon" />
            Telemetry
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
