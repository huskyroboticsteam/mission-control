import {useSelector} from 'react-redux'
import {selectOpMode} from '../../store/opModeSlice'
import './OpModeSelect.css'
import NavigationStatus from './NavigationStatus'

function OpModeSelect() {
  const opMode = useSelector(selectOpMode)

  return (
    <div className={`op-mode-select op-mode-select--${opMode}`}>
      <p>
        Current operation mode:{' '}
        <span className={`op-mode-select__op-mode op-mode-select__op-mode--${opMode}`}>
          {opMode}
        </span>
      </p>
      {opMode === 'autonomous' && <NavigationStatus />}
    </div>
  )
}

export default OpModeSelect