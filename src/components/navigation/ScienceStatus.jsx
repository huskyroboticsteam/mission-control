import {useSelector} from 'react-redux'
import {getSpeed} from '../../store/inputSlice'

function ScienceStatus() {
  const speed = useSelector(getSpeed)
  return (
    <p>
      Current linkage speed: <br /> {speed}%
    </p>
  )
}

export default ScienceStatus
