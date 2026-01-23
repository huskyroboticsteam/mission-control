import {useSelector} from 'react-redux'
import {selectMotorsLimitSwitches} from '../../store/motorsSlice'

function LimitSwitchStatus() {
    const motorsLimitSwitchStatus = useSelector(selectMotorsLimitSwitches)
    return (
        <div>
            <h2>Arm switch status ({(String)(motorsLimitSwitchStatus.armLimitSwitchStatus)})</h2>
            <h2>Shoulder switch status ({(String)(motorsLimitSwitchStatus.shoulderLimitSwitchStatus)})</h2>
            <h2>Elbow switch status ({(String)(motorsLimitSwitchStatus.elbowLimitSwitchStatus)})</h2>
            <h2>Forearm switch status ({(String)(motorsLimitSwitchStatus.forearmLimitSwitchStatus)})</h2>
        </div>
        
    )
}

export default LimitSwitchStatus

