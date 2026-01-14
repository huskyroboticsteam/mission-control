import {useDispatch, useSelector} from 'react-redux'
import {requestOpMode, selectOpMode} from '../../store/opModeSlice'
import './OpModeToggleButton.css'

function OpModeToggleButton() {
  const dispatch = useDispatch()
  const opMode = useSelector(selectOpMode)

  const handleClick = () => {
    if (opMode === 'teleoperation') {
      dispatch(requestOpMode({mode: 'autonomous'}))
    } else if (opMode === 'autonomous') {
      dispatch(requestOpMode({mode: 'teleoperation'}))
    }
  }

  const buttonClassName = `op-mode-toggle-button--${opMode}`

  return (
    <div className="op-mode-toggle-button">
      <button className={buttonClassName} onClick={handleClick}>
        Switch to {opMode === 'teleoperation' ? 'Autonomous' : 'Teleoperation'}
      </button>
    </div>
  )
}

export default OpModeToggleButton
