import {useDispatch, useSelector} from 'react-redux'
import React, {useState} from 'react'
import {
  selectAllServoNames,
  selectServoCurrentPosition,
  requestServoPosition,
} from '../../store/servoSlice.js'
import camelCaseToTitle from '../../util/camelCaseToTitle.js'
import {SERVOS, ServoType} from '../../constants/servoConstants.js'
import './Servo.css'

function Servos() {
  const dispatch = useDispatch()
  const servoNames = useSelector(selectAllServoNames)

  return (
    <div>
      <table id="servo-table">
        <thead>
          <tr>
            {servoNames.map((servo) => (
              <th>{camelCaseToTitle(servo)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {servoNames.map((servo) => (
              <td key={servo}>
                <ServoControls servoName={servo} key={servo} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function ServoControls({servoName}) {
  // const position = useSelector(selectServoCurrentPosition(servoName))
  const servo = SERVOS[servoName as keyof typeof SERVOS]
  const hi = servo.type == ServoType.Positional ? servo.limits.hi : servo.range.max
  const lo = servo.type == ServoType.Positional ? servo.limits.lo : servo.range.min

  const dispatch = useDispatch()

  const [input, setInput] = useState((lo + hi) / 2)

  const handleInput: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    dispatch(requestServoPosition({servoName, position: input}))
  }

  // Put lambda functions in here to actually call servo position requests (handle inputs?)
  return (
    <div className={`servo-control-col ${servoName}`} key={servoName}>
      <button
        className="servo-control hi"
        onClick={() => {
          dispatch(requestServoPosition({servoName, position: hi}))
        }}>
        {hi}
      </button>
      {servo.type == ServoType.Positional ? (
        <form onSubmit={handleInput}>
          <input
            className="servo-input"
            type="number"
            step="any"
            value={input}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </form>
      ) : (
        <button
          className="servo-control dead"
          onClick={() => requestServoPosition({servoName, position: servo.range.dead})}>
          {servo.range.dead}
        </button>
      )}
      <button
        className="servo-control lo"
        onClick={() => {
          dispatch(requestServoPosition({servoName, position: lo}))
        }}>
        {lo}
      </button>
    </div>
  )
}

export default Servos
