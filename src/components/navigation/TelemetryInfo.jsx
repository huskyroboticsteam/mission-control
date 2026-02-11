import {useSelector} from 'react-redux'
import {selectRoverPosition} from '../../store/telemetrySlice'
import './TelemetryInfo.css'
import {Quaternion, Euler} from '@math.gl/core'

function sanitize(num, decimals) {
  if (num == null) return 'N/A'
  if (decimals != null) return num.toFixed(decimals)
  return num.toString()
}

export default function TelemetryInfo() {
  const {orientW, orientX, orientY, orientZ, lon, lat, alt} = useSelector(selectRoverPosition)

  let roll = null
  let pitch = null
  let heading = null

  if (orientW != null && orientX != null && orientY != null && orientZ != null) {
    let quat = new Quaternion(orientX, orientY, orientZ, orientW)
    let rpy = new Euler().fromQuaternion(quat, Euler.ZYX)

    roll = (rpy.roll * 180) / Math.PI
    pitch = (rpy.pitch * 180) / Math.PI
    heading = (-rpy.yaw * 180) / Math.PI
  }

  return (
    <div className="telemetry-card">
      <div className="telemetry-row">
        <div className="telemetry-label">Roll:</div>
        <div className="telemetry-value">{sanitize(roll, 0)}</div>
      </div>

      <div className="telemetry-row">
        <div className="telemetry-label">Pitch:</div>
        <div className="telemetry-value">{sanitize(pitch, 0)}</div>
      </div>

      <div className="telemetry-row">
        <div className="telemetry-label">Heading:</div>
        <div className="telemetry-value">{sanitize(heading, 0)}</div>
      </div>

      <div className="telemetry-row">
        <div className="telemetry-label">Latitude:</div>
        <div className="telemetry-value">{sanitize(lat, 6)}</div>
      </div>

      <div className="telemetry-row">
        <div className="telemetry-label">Longitude:</div>
        <div className="telemetry-value">{sanitize(lon, 6)}</div>
      </div>

      <div className="telemetry-row">
        <div className="telemetry-label">Altitude:</div>
        <div className="telemetry-value">{sanitize(alt, 2)}</div>
      </div>
    </div>
  )
}
