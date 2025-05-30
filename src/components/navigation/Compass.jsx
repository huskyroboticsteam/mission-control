import React, {useState, useEffect, useCallback} from 'react'
import {useSelector} from 'react-redux'
import {selectRoverPosition} from '../../store/telemetrySlice'
import {selectLongitude, selectLatitude} from '../../store/waypointNavSlice'
import './Compass.css'
import {Quaternion, Euler, Vector3, clamp} from '@math.gl/core'
import * as Quat from 'gl-matrix/quat'

const CLOSE_DISTANCE = 0.5 // Distance to be considered at the target
const FAR_DISTANCE = 20.0 // Distance to be considered far from the target

function getAttitude(roll, pitch) {
  let attitudeRPY = new Euler().fromRollPitchYaw(roll, pitch, 0.0)
  // taken from Euler.getQuaternion(), which we can't call because it's broken
  let attitudeQuat = new Quaternion()
    .rotateZ(attitudeRPY.x)
    .rotateX(attitudeRPY.y)
    .rotateY(attitudeRPY.z)
  let attitude = Quat.getAxisAngle(new Vector3(), attitudeQuat)
  return attitude
}

/**
 * Sanitize telemetry for display.
 * @param {*} num Nullable. The number to sanitize.
 * @param {*} decimals Optional. If specified, number of decimal places to round.
 * @returns The sanitized string.
 */
function sanitize(num, decimals) {
  if (num == null) {
    return 'N/A'
  }

  let ret = num.toString()
  if (decimals !== undefined) {
    ret = num.toFixed(decimals)
  }

  return num >= 0 ? ' ' + ret : ret
}

/**
 * Convert latitude and longitudes to heading.
 * @see https://www.igismap.com/formula-to-find-bearing-or-heading-angle-between-two-points-latitude-longitude/
 * @param lati latitude of starting point in degrees.
 * @param loni longitude of starting point in degrees.
 * @param latf latitude of ending point in degrees.
 * @param lonf longitude of ending point in degrees.
 * @return The heading of the ending point relative to North (CW is +) in degrees.
 */
function convertCoordsToHeading(lati, loni, latf, lonf) {
  const DEGREES_TO_RADIANS = Math.PI / 180
  lati *= DEGREES_TO_RADIANS
  loni *= DEGREES_TO_RADIANS
  latf *= DEGREES_TO_RADIANS
  lonf *= DEGREES_TO_RADIANS

  const deltaL = lonf - loni
  const x = Math.cos(latf) * Math.sin(deltaL)
  const y = Math.cos(lati) * Math.sin(latf) - Math.sin(lati) * Math.cos(latf) * Math.cos(deltaL)
  const bearing = Math.atan2(x, y)
  return bearing / DEGREES_TO_RADIANS
}

/**
 * Convert latitude and longitudes to distance.
 * @see https://en.wikipedia.org/wiki/Haversine_formula
 * @param lati latitude of starting point in degrees.
 * @param loni longitude of starting point in degrees.
 * @param latf latitude of ending point in degrees.
 * @param lonf longitude of ending point in degrees.
 * @param radius radius of the planet in km (default is Earth: 6,371km).
 * @return The distance in km.
 */
function convertCoordsToDistance(lati, loni, latf, lonf, radius = 6371) {
  const DEGREES_TO_RADIANS = Math.PI / 180
  lati *= DEGREES_TO_RADIANS
  loni *= DEGREES_TO_RADIANS
  latf *= DEGREES_TO_RADIANS
  lonf *= DEGREES_TO_RADIANS

  let h =
    (1 - Math.cos(latf - lati) + Math.cos(lati) * Math.cos(latf) * (1 - Math.cos(lonf - loni))) / 2
  h = clamp(h, 0, 1) // ensure 0 <= h <= 1
  const d = 2 * radius * Math.asin(Math.sqrt(h))
  return d
}

const TARGET_CIRCLE_OFFSET = 42.5 // how many degrees the target "circle" needs to be offset
const Compass = () => {
  const {orientW, orientX, orientY, orientZ, lon, lat, alt} = useSelector(selectRoverPosition)

  let roll
  let pitch
  let yaw
  let needleColor

  if (orientW == null || orientX == null || orientY == null || orientZ == null) {
    needleColor = 'gray'
  } else {
    let quat = new Quaternion(orientX, orientY, orientZ, orientW)
    let rpy = new Euler().fromQuaternion(quat, Euler.ZYX)
    let attitude = getAttitude(rpy.roll, rpy.pitch)
    roll = Math.round((rpy.roll * 180) / Math.PI)
    pitch = Math.round((rpy.pitch * 180) / Math.PI)
    yaw = Math.round((rpy.yaw * 180) / Math.PI)

    if (Math.abs(attitude) < 20) {
      needleColor = 'green'
    } else if (Math.abs(attitude) < 45) {
      needleColor = 'yellow'
    } else {
      needleColor = 'red'
    }
  }
  const heading = yaw != null ? -yaw : undefined // yaw is CCW, heading is CW

  const [targetHeading, setTargetHeading] = useState(null)
  const [targetDistance, setTargetDistance] = useState(null)
  const targetLongitude = useSelector(selectLongitude)
  const targetLatitude = useSelector(selectLatitude)

  /**
   * Method to create text for the target distance indiciator
   */
  function distanceToText(dist) {
    if (dist == null) return 'Unknown'
    if (dist > FAR_DISTANCE) {
      return `>${FAR_DISTANCE.toFixed(1)} m`
    } else if (dist < CLOSE_DISTANCE) {
      return `<${CLOSE_DISTANCE.toFixed(1)} m`
    } else {
      return `${targetDistance.toFixed(1)} m`
    }
  }

  useEffect(() => {
    if (targetLongitude == null || targetLatitude == null || lat == null || lon == null) {
      setTargetHeading(null)
      setTargetDistance(null)
      return
    }
    setTargetHeading(convertCoordsToHeading(lat, lon, targetLatitude, targetLongitude))
    let dist = convertCoordsToDistance(lat, lon, targetLatitude, targetLongitude) * 1000
    setTargetDistance(dist)
  }, [targetLatitude, targetLongitude, lat, lon])

  return (
    <div className="compass-container">
      <div className="info">
        <table>
          <tbody>
            <tr>
              <td>roll:</td>
              <td>{sanitize(roll)}</td>
            </tr>
            <tr>
              <td>pitch:</td>
              <td>{sanitize(pitch)}</td>
            </tr>
            <tr>
              <td>heading:</td>
              <td>{sanitize(heading)}</td>
            </tr>
            <tr>
              <td>latitude:</td>
              <td>{sanitize(lat, 6)}</td>
            </tr>
            <tr>
              <td>longitude:</td>
              <td>{sanitize(lon, 6)}</td>
            </tr>
            <tr>
              <td>altitude:</td>
              <td>{sanitize(alt, 6)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="compass">
        <div className="compass-parts">
          {targetHeading != null && targetDistance > CLOSE_DISTANCE && (
            <div
              className={`target-dot`}
              style={{transform: `rotate(${targetHeading + TARGET_CIRCLE_OFFSET}deg)`}}></div>
          )}
          <div
            className={`compass__needle compass__needle--${needleColor}`}
            style={{transform: `rotate(${heading ?? 0}deg)`}}></div>
          <div className={`compass__outer-ring ${needleColor}`}></div>
          <div className="compass__label compass__label--north">N</div>
          <div className="compass__label compass__label--south">S</div>
          <div className="compass__label compass__label--west">W</div>
          <div className="compass__label compass__label--east">E</div>
          {targetDistance != null && (
            <div className="compass__label compass__label--distance">
              <span className={targetDistance > CLOSE_DISTANCE ? 'target-far' : 'target-close'}>
                Target: {distanceToText(targetDistance)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Compass
