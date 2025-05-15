import {useDispatch, useSelector} from 'react-redux'
import React from 'react'
import {selectAllServoNames, selectServoCurrentPosition, requestServoPosition} from '../../store/servoSlice.js'
import camelCaseToTitle from '../../util/camelCaseToTitle.js'

function Servos() {
  const dispatch = useDispatch()
  const servoNames = useSelector(selectAllServoNames)

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Servo</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {servoNames.map((servoName) => (
            <ServoData servoName={servoName} key={servoName} />
          ))}
        </tbody>
      </table>
      <button onClick={() => {
        dispatch(
          requestServoPosition({
            servoName: "cuvette",
            position: 160
          })
        )
      }}>Up</button>
      <button onClick={() => {
        dispatch(
          requestServoPosition({
            servoName: "cuvette",
            position: 85
          })
        )
      }}>Down</button>
    </div>
  )
}

function ServoData({servoName}) {
  const position = useSelector(selectServoCurrentPosition(servoName))
  const servoTitle = camelCaseToTitle(servoName)

  return (
    <tr>
      <td>{servoTitle}</td>
      <td>{position != null ? position : 'N/A'}</td>
    </tr>
  )
}

export default Servos
