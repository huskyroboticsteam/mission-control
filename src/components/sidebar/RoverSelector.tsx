import {type ChangeEventHandler} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {disconnectFromRover, requestRoverHost, selectRoverHost} from '../../store/roverSocketSlice.js'
import './RoverSelector.css'
import React from 'react'
import { IS_DEV, ROVER_HOSTS } from '../../constants/networkConstants.js'

export const RoverSelector = () => {
  const dispatch = useDispatch()
  const host = useSelector(selectRoverHost)

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const host = e.target.value
    dispatch(requestRoverHost({host: host}))
    // RoverSocketManager will reconnect automatically
    dispatch(disconnectFromRover())
  }

  return (
    <div className="rover-selector">
      <label className="rover-selector__label">Rover</label>
      <select className="rover-selector__select" value={host} onChange={handleChange} disabled={IS_DEV}>
        {['localhost', ...ROVER_HOSTS].map((host) => (
          <option key={host} value={host}>
            {host}
          </option>
        ))}
      </select>
    </div>
  )
}
