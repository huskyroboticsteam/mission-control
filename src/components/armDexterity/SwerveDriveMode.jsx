import { useDispatch, useSelector } from 'react-redux';
import { requestSwerveDriveMode, selectSwerveDriveMode, selectSwerveDriveOverride } from '../../store/swerveDriveModeSlice';
import './SwerveDriveMode.css'

function SwerveDriveMode() {
  const dispatch = useDispatch();
  const mode = useSelector(selectSwerveDriveMode);
  const override = useSelector(selectSwerveDriveOverride);

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
          <button disabled className={"front left wheel"} />
          <button disabled className={"front right wheel"} />
          <button disabled className={"back left wheel"} />
          <button disabled className={"back right wheel"} />
        </div>
      </div>
    </div>
  )
}

export default SwerveDriveMode