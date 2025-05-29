import {useDispatch, useSelector} from 'react-redux'
import React, {useState} from 'react'

import camelCaseToTitle from '../../util/camelCaseToTitle.js'
import {requestStepperTurnAngle, selectAllStepperNames} from '../../store/stepperSlice.js'

function Steppers() {
  const stepperNames = useSelector(selectAllStepperNames)

  return (
    <div>
      <table id="stepper-table">
        <tbody>
          {stepperNames.map((stepper) => (
            <StepperControls stepperName={stepper} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StepperControls({stepperName}) {
  const dispatch = useDispatch()
  const [input, setInput] = useState(0)

  const handleInput: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    dispatch(requestStepperTurnAngle({stepperName, angle: input}))
  }

  return (
    <tr className={`stepper-control-col ${stepperName}`}>
      <td>{camelCaseToTitle(stepperName)}</td>
      <td>
        <form onSubmit={handleInput}>
          <input
            className="stepper-input"
            type="number"
            step="any"
            value={input}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </form>
      </td>
    </tr>
  )
}

export default Steppers
