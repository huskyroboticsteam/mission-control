import {useDispatch, useSelector} from 'react-redux'
import {requestOpMode, selectOpMode} from '../../store/opModeSlice'
import './OpModeSelect.css'
import NavigationStatus from './NavigationStatus'

function OpModeSelect() {
  const dispatch = useDispatch()
  const opMode = useSelector(selectOpMode)

  const handleClick = () => {
    if (opMode === 'teleoperation') {
      dispatch(requestOpMode({mode: 'autonomous'}))
    } else if (opMode === 'autonomous') {
      dispatch(requestOpMode({mode: 'teleoperation'}))
    }
  }

  return (
    <div className={`op-mode-select op-mode-select--${opMode}`}>
      <p>
        Current operation mode:{' '}
        <span className={`op-mode-select__op-mode op-mode-select__op-mode--${opMode}`}>
          {opMode}
        </span>
      </p>
      <button onClick={handleClick}>
        Switch to {opMode === 'teleoperation' ? 'Autonomous' : 'Teleoperation'}
      </button>
      {opMode === 'autonomous' && <NavigationStatus />}
    </div>
  )
}

export default OpModeSelect
