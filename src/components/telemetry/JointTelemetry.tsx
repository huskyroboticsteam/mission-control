import {useSelector} from 'react-redux'
import {selectJointCurrentPosition} from '../../store/jointSlice.js'

import {camelCaseToTitle} from '../../util/camelCaseToTitle.js'
import './JointTelemetry.css'
import {JointNames} from '../../constants/jointConstants.js'
import React from 'react'
import {enumKeys} from '../../util/enumKeys.js'

export const JointTelemetry = () => {
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
          {enumKeys(JointNames).map((motorName) => (
            <MotorData motorName={motorName} key={motorName} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

const MotorData = ({motorName}: {motorName: keyof typeof JointNames}) => {
  const position = useSelector(selectJointCurrentPosition(motorName))
  const motorTitle = camelCaseToTitle(motorName)

  return (
    <tr className="motor-telemetry__motor-data">
      <td>{motorTitle}</td>
      <td>{position != null ? `${Math.round(position)}°` : 'N/A'}</td>
    </tr>
  )
}
