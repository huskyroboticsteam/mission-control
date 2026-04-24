import {Navbar} from './Navbar.js'
import {EmergencyStopButton} from './EmergencyStopButton.js'
import {EnableMotorsButton} from './EnableMotorsButton.js'
import {InputInfo} from './InputInfo.js'
import {ConnectionInfo} from './ConnectionInfo.js'
import OpModeSelect from '../navigation/OpModeToggleButton.js'
import './Sidebar.css'
import React from 'react'
import { RoverSelector } from './RoverSelector.js'

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <OpModeSelect />
      <EmergencyStopButton />
      <EnableMotorsButton />
      <InputInfo />
      <RoverSelector />
      <ConnectionInfo />
    </div>
  )
}
