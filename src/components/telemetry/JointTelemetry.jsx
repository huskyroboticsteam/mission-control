import {useSelector} from 'react-redux'
import {selectJointCurrentPosition, selectAllJointNames} from '../../store/jointsSlice'

import camelCaseToTitle from '../../util/camelCaseToTitle'
import './JointTelemetry.css'

function JointTelemetry() {
  const jointNames = useSelector(selectAllJointNames)

  return (
    <div className="motor-telemetry">
      <table>
        <thead>
          <tr>
            <th>Joint</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {jointNames.map((motorName) => (
            <MotorData motorName={motorName} key={motorName} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MotorData({motorName}) {
  const position = useSelector(selectJointCurrentPosition(motorName))
  const motorTitle = camelCaseToTitle(motorName)

  return (
    <tr className="motor-telemetry__motor-data">
      <td>{motorTitle}</td>
      <td>{position != null ? `${Math.round(position)}°` : 'N/A'}</td>
    </tr>
  )
}

export default JointTelemetry
