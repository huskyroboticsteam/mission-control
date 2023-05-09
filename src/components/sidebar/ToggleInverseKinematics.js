import { useDispatch, useSelector } from "react-redux";
import { selectMotorsAreEnabled, enableMotors } from "../../store/motorsSlice";
import { useState } from 'react'
import "./ToggleInverseKinematics.css";

function ToggleInverseKinematics() {
    const [IKEnabled, setIKEanbled] = useState(false);
    // const dispatch = useDispatch();
    // const motorsEnabled = useSelector(selectMotorsAreEnabled);

    const handleClick = () => {
        // dispatch(enableMotors({ enabled: !motorsEnabled }));
        setIKEanbled(!IKEnabled && window.confirm("Turning on inverse kinematics requires that the motors are calibrated.  You must be sure the motors are calibrated or the robot will break."));
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
