import {useDispatch, useSelector} from 'react-redux'
import {selectIsStopped, requestStop} from '../../store/emergencyStopSlice'
import './EmergencyStopButton.css'

function EmergencyStopButton() {
  const dispatch = useDispatch()
  const stopEngaged = useSelector(selectIsStopped)

  const handleClick = () => {
    dispatch(requestStop({stop: !stopEngaged}))
  }

  const className =
    'emergency-stop-button emergency-stop-button--' + (stopEngaged ? 'stopped' : 'operational')
  const text = stopEngaged ? 'Disgengage Stop' : 'Emergency Stop'

  return (
    <div className={className}>
      <button onClick={handleClick}>{text}</button>
    </div>
  )
}

export default EmergencyStopButton
