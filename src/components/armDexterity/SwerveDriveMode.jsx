import { useDispatch, useSelector } from 'react-redux';
import { requestSwerveDriveMode, selectSwerveDriveMode, selectSwerveDriveOverride } from '../../store/swerveDriveModeSlice';
import { selectJointCurrentPosition } from "../../store/jointsSlice";
import './SwerveDriveMode.css'

function SwerveDriveMode() {
  const dispatch = useDispatch();
  const mode = useSelector(selectSwerveDriveMode);
  const override = useSelector(selectSwerveDriveOverride);

  const lfPos = useSelector(selectJointCurrentPosition("frontLeftSwerve"));
  const rfPos = useSelector(selectJointCurrentPosition("frontRightSwerve"));
  const lrPos = useSelector(selectJointCurrentPosition("rearLeftSwerve"));
  const rrPos = useSelector(selectJointCurrentPosition("rearRightSwerve"));

  const changeDrive = (event) => {
    dispatch(requestSwerveDriveMode({
      mode: event.target.value,
      override: override
    }));
    document.activeElement.blur();
  }

  const changeOverride = (event) => {
    dispatch(requestSwerveDriveMode({
      mode: mode,
      override: event.target.checked
    }));
  }

  return (
    <div className="swerveDriveMode">
      <div className="rover">
        <div className="titleContainer">
          <label className="title">Drive Mode</label>
        </div>
        <select value={mode} onChange={changeDrive}>
          <option value="normal">Normal</option>
          <option value="turn-in-place">Turn</option>
          <option value="crab">Crab</option>
        </select>
        <div className="override">
          <input type="checkbox" defaultChecked={override} onChange={changeOverride}/>
          <label className="overrideLabel">Override Threshold?</label>
        </div>
        <div>
          <button disabled className={"front left wheel"} style={{transform: `rotate(${-lfPos}deg)`}} />
          <button disabled className={"front right wheel"} style={{transform: `rotate(${-rfPos}deg)`}} />
          <button disabled className={"back left wheel"} style={{transform: `rotate(${-lrPos}deg)`}} />
          <button disabled className={"back right wheel"} style={{transform: `rotate(${-rrPos}deg)`}} />
        </div>
      </div>
    </div>
  )
}

export default SwerveDriveMode