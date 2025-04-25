import {useSelector} from 'react-redux'
import React, {useState} from 'react'
import {selectRoverPosition} from '../../store/telemetrySlice'
import {selectPoints} from '../../store/waypointNavSlice'
import './NavigationStatus.css'
import {POSITION_THRESHOLD, APPROACHING_THRESHOLD} from '../../constants/navigationConstants'

//MAJOR ISSUE: CONSTANTS ARE IN METERS BUT CURRENT DATA IS IN LATITUDE/LONGITUDE.
//I DO NOT GET THE MATH VERY WELL SO I AM STRUGGLING

/*// see comments at top of file for source for math
double phi = PI * origin.lat / 180.0;
double cosPhi = std::cos(phi);
double sinPhi = std::sin(phi);

double a = datum.getA();
double eSq = datum.getSquareEccentricity();
double oneMinusESqSinSqPhi = 1 - eSq * std::pow(sinPhi, 2);

metersPerDegLon = (PI * a * cosPhi) / (180.0 * std::sqrt(oneMinusESqSinSqPhi));
metersPerDegLat = (PI * a * (1 - eSq)) / (180.0 * std::pow(oneMinusESqSinSqPhi, 1.5));*/

function calculateDistance(lat1, lon1, lat2, lon2) {
  const latDiff = Math.abs(lat1 - lat2)
  const lonDiff = Math.abs(lon1 - lon2)
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff)
}

function sanitize(num, decimals) {
  if (num == null) {
    return 'N/A'
  }
  let ret = num.toString()
  if (decimals !== undefined) {
    ret = num.toFixed(decimals)
  }
  return num >= 0 ? ret : ret
}

function NavigationStatus() {
  const {lon, lat} = useSelector(selectRoverPosition)
  const targetPoints = useSelector(selectPoints)
  const targetLatitude = Array.isArray(targetPoints[0]) ? parseInt(targetPoints[0][0]) : null
  const targetLongitude = Array.isArray(targetPoints[0]) ? parseInt(targetPoints[0][1]) : null
  

  const getNavigationStatus = () => {
    // Guard against null or undefined values
    //Also guards against the value of 0. Unlikely to be an issue but it is of note
    if (!lon || !lat || !targetLatitude || !targetLongitude) {
      console.log("lon: " + !lon)
      console.log("lat: " + !lat)
      console.log("targetLatitude: " + !targetLatitude)
      console.log("targetLatitude type: " + typeof targetLatitude)
      console.log("targetLatitude value: " + targetLatitude)
      console.log("targetLongitude type: " + typeof targetLongitude)
      console.log("targetLongitude value: " + targetLongitude)
      console.log("targetLongitude: " + !targetLongitude)
      console.log("isArray: " + Array.isArray(targetPoints[0]))
      console.log("array: " + targetPoints)
      return {
        status: 'unknown',
        distance: null,
        color: 'gray',
      }
    }

    const distance = calculateDistance(lat, lon, targetLatitude, targetLongitude)

    if (distance <= POSITION_THRESHOLD) {
      //IMPORTANT NOTE: THE targetPoints VARIABLE IS SOMEWHAT DISCONNECTED FROM THE STATE. REMOVING VALUES HERE WILL NOT REMOVE THEM FROM THE STATE
      //THIS SHOULD BE FINE BECAUSE THE STATE IS NOT MODIFIED, ONLY REPLACED, WHICH SHOULD UPDATE targetPoints, AND THE ONLY TIME THE STATE IS
      //UPDATED IS WHEN IT GETS AN ENTIRELY NEW ARRAY
      //checking that the array doesn't include the location the rover is at, and if does, delete it
      //not sure how often this check is run, but I imagine running this if constantly won't be the greaters for performance
      //there is potential to have buggy point removal, better method would be for rover to send the point to be removed & to see if the first point is the same
      console.log("Latitude distance: " + Math.abs(lat - targetPoints[0][0]))
      console.log("Longitude distance: " + Math.abs(lon - targetPoints[0][1]))
      console.log("Position threshold: " + POSITION_THRESHOLD)
      if (Math.abs(lat - targetPoints[0][0]) < POSITION_THRESHOLD && Math.abs(lon - targetPoints[0][1]) < POSITION_THRESHOLD) {
        targetPoints.shift()
      }
      console.log(targetPoints)
      console.log(useSelector(selectPoints))
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
            Current: ({sanitize(lat, 6)}, {sanitize(lon, 6)})
          </div>
          <div>
            Target: ({sanitize(targetLatitude, 6)}, {sanitize(targetLongitude, 6)})
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavigationStatus
