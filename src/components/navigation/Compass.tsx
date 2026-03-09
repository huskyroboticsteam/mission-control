import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectRoverPosition} from '../../store/telemetrySlice.js'
import {selectLongitude, selectLatitude} from '../../store/waypointNavSlice.js'
import './Compass.css'
import {Quaternion, Euler} from '@math.gl/core'
import {convertCoordsToDistance, convertCoordsToHeading} from '../../util/gps.js'
import {APPROACHING_THRESHOLD} from '../../constants/navigationConstants.js'

export const Compass = () => {
  const {orientW, orientX, orientY, orientZ, lon, lat, alt} = useSelector(selectRoverPosition)
  const quat = new Quaternion(orientX!, orientY!, orientZ!, orientW!)
  const rpy = new Euler().fromQuaternion(quat)
  const heading = rpy.yaw

  // let quat = new Quaternion(orientX, orientY, orientZ, orientW)
  // let rpy = new Euler().fromQuaternion(quat, Euler.ZYX)
  // let attitude = getAttitude(rpy.roll, rpy.pitch)
  // roll = Math.round((rpy.roll * 180) / Math.PI)
  // pitch = Math.round((rpy.pitch * 180) / Math.PI)
  // yaw = Math.round((rpy.yaw * 180) / Math.PI)

  // const heading = yaw != null ? -yaw : undefined // yaw is CCW, heading is CW

  const [targetHeading, setTargetHeading] = useState<number | null>(null)
  const [targetDistance, setTargetDistance] = useState<number | null>(null)
  const targetLongitude = useSelector(selectLongitude)
  const targetLatitude = useSelector(selectLatitude)

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
              <td>{rpy.roll}</td>
            </tr>
            <tr>
              <td>pitch:</td>
              <td>{rpy.pitch}</td>
            </tr>
            <tr>
              <td>heading:</td>
              <td>{heading}</td>
            </tr>
            <tr>
              <td>latitude:</td>
              <td>{lat}</td>
            </tr>
            <tr>
              <td>longitude:</td>
              <td>{lon}</td>
            </tr>
            <tr>
              <td>altitude:</td>
              <td>{alt}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="compass">
        <div className="compass-parts">
          {targetHeading != null && targetDistance! > APPROACHING_THRESHOLD && (
            <div className={`target-dot`} style={{transform: `rotate(${targetHeading}deg)`}}></div>
          )}
          <div
            className={`compass__needle compass__needle--green}`}
            style={{transform: `rotate(${heading ?? 0}deg)`}}></div>
          <div className={`compass__outer-ring green`}></div>
          <div className="compass__label compass__label--north">N</div>
          <div className="compass__label compass__label--south">S</div>
          <div className="compass__label compass__label--west">W</div>
          <div className="compass__label compass__label--east">E</div>
          {targetDistance != null && (
            <div className="compass__label compass__label--distance">
              <span
                className={targetDistance > APPROACHING_THRESHOLD ? 'target-far' : 'target-close'}>
                Target: {targetDistance}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Compass
