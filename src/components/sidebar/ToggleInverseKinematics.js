import { useDispatch, useSelector } from "react-redux";
import { selectInverseKinematicsEnabled, enableIK } from "../../store/inverseKinematicsSlice";
import "./ToggleInverseKinematics.css";

function ToggleInverseKinematics() {
    const dispatch = useDispatch();
    const IKEnabled = useSelector(selectInverseKinematicsEnabled);  // change select

    const handleClick = () => {
        dispatch(enableIK({ enable: !IKEnabled && window.confirm("Turning on inverse kinematics requires that the motors are calibrated.  You must be sure the motors are calibrated or the robot will break.") })); // change dispatch
    };

    return (
        <div id='enable-ik-toggle'>
            <div id='enable-ik-title'>
                Enable IK
            </div>
            <div id='switch-wrapper' onClick={handleClick}>
                <div id={ IKEnabled ? 'disable-ik' : 'enable-ik'} className='ik-switch'>
                    <div id={ IKEnabled ? 'disable-ik-handle' : 'enable-ik-handle'} className='switch-handle'>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ToggleInverseKinematics;
