import {useSelector} from 'react-redux'
import {SignalCellularAlt as ConnectionIcon} from '@mui/icons-material'
import {selectRoverIsConnected} from '../../store/roverSocketSlice.js'
import './ConnectionInfo.css'
import React from 'react'

export const ConnectionInfo = () => {
  const roverIsConnected = useSelector(selectRoverIsConnected)
  if (roverIsConnected) {
    return (
      <div className="connection-info connection-info--connected">
        <ConnectionIcon fontSize="large" />
        <p>Connected to rover</p>
      </div>
    )
  } else {
    return (
      <div className="connection-info connection-info--disconnected">
        <ConnectionIcon fontSize="large" />
        <p>Rover not connected</p>
      </div>
    )
  }
}
