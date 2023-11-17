import { useDispatch, useSelector } from "react-redux";
import { selectInverseKinematicsEnabled, enableIK } from "../../store/inputSlice";
import { selectMotorsAreEnabled } from "../../store/motorsSlice";
import { selectRoverIsConnected } from "../../store/roverSocketSlice";
import "./ToggleInverseKinematics.css";

function ToggleInverseKinematics() {
    const dispatch = useDispatch();
    const IKEnabled = useSelector(selectInverseKinematicsEnabled);
    const motorsEnabled = useSelector(selectMotorsAreEnabled);
    const roverIsConnected = useSelector(selectRoverIsConnected);

    const handleClick = () => {
        if (roverIsConnected && motorsEnabled) {
            dispatch(enableIK({ enable: !IKEnabled && window.confirm("Turning on inverse kinematics requires that the motors are calibrated.  You must be sure the motors are calibrated or the robot will break.") })); // change dispatch
        }
    };

    return (
        <div id='enable-ik-toggle'>
            <div id={motorsEnabled ? 'enable-ik-title' : 'enable-ik-title-disabled'}>
                Enable IK
            </div>
            <div id={roverIsConnected && motorsEnabled ? 'switch-wrapper' : 'switch-wrapper-disabled'} onClick={handleClick}>
                <div id={ IKEnabled ? 'disable-ik' : 'enable-ik'} className='ik-switch'>
                    <div id={IKEnabled ? 'disable-ik-handle' : 'enable-ik-handle'} className={roverIsConnected && motorsEnabled ? 'switch-handle' : ' switch-handle-disconnected'}>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ToggleInverseKinematics;
