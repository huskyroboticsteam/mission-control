import {useSelector} from 'react-redux'
import {selectRoverPosition} from '../../store/telemetrySlice.js'
import {selectLatitude, selectLongitude} from '../../store/waypointNavSlice.js'
import './NavigationStatus.css'
import {POSITION_THRESHOLD, APPROACHING_THRESHOLD} from '../../constants/navigationConstants.js'
import { convertCoordsToDistance } from '../../util/gps.js'
import React from 'react'

export const NavigationStatus = () => {
  const {lat, lon} = useSelector(selectRoverPosition)
  const targetLatitude = useSelector(selectLatitude)
  const targetLongitude = useSelector(selectLongitude)

  const getNavigationStatus = () => {
    // Guard against null or undefined values
    if (!lon || !lat || !targetLatitude || !targetLongitude) {
      return {
        status: 'unknown',
        distance: null,
        color: 'gray',
      }
    }

    const distance = convertCoordsToDistance(lat, lon, targetLatitude, targetLongitude) * 1000

    if (distance <= POSITION_THRESHOLD) {
      return {
        status: 'reached',
        distance,
        color: 'green',
      }
    } else if (distance <= APPROACHING_THRESHOLD) {
      return {
        status: 'approaching',
        distance,
        color: 'yellow',
      }
    } else {
      return {
        status: 'navigating',
        distance,
        color: 'red',
      }
    }
  }

  const navStatus = getNavigationStatus()

  return (
    <div className={`nav-status nav-status--${navStatus.color}`}>
      <div className="nav-status__header">Navigation Status</div>
      <div className="nav-status__content">
        <div>
          Status:{' '}
          <span className={`nav-status__label--${navStatus.color}`}>{navStatus.status}</span>
        </div>
        <div>Distance: {navStatus.distance ? navStatus.distance.toFixed(6) : 'N/A'}</div>
        <div className="nav-status__coordinates">
          <div>
            Current: ({lat}, {lon})
          </div>
          <div>
            Target: ({targetLatitude}, {targetLongitude})
          </div>
        </div>
      </div>
    </div>
  )
}
