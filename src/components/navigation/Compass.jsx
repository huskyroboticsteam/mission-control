import React from 'react'
import {useSelector} from 'react-redux'
import {selectRoverPosition} from '../../store/telemetrySlice'
import './Compass.css'
import {Quaternion, Euler, Vector3} from '@math.gl/core'
import * as Quat from 'gl-matrix/quat'

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
      <div class="scaled">
      <div className="compass">
        <div className="compass-parts">
          <div
            className={`compass__needle compass__needle--${needleColor}`}
            style={{transform: `rotate(${heading ?? 0}deg)`}}></div>
          <div className={`compass__outer-ring ${needleColor}`}></div>
          <div className="compass__label compass__label--north">N</div>
          <div className="compass__label compass__label--south">S</div>
          <div className="compass__label compass__label--west">W</div>
          <div className="compass__label compass__label--east">E</div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Compass
