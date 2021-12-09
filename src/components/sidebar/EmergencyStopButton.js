import { useDispatch, useSelector } from "react-redux";
import { emergencyStopRequested, selectRoverIsConnected, selectEmergencyStopEngaged } from "../../store/roverSlice";
import "./EmergencyStopButton.css";

function EmergencyStopButton() {
  const dispatch = useDispatch();
  const roverIsConnected = useSelector(selectRoverIsConnected)
  const stopEngaged = useSelector(selectEmergencyStopEngaged);

  const handleClick = () => {
    if (roverIsConnected) {
      const it = emergencyStopRequested({ stop: !stopEngaged });
      dispatch(it);
    }
  };

  let className = "emergency-stop-button";
  let text;
  if (roverIsConnected) {
    if (stopEngaged) {
      className += " emergency-stop-button--stopped";
      text = "Disengage Stop"
    } else {
      className += " emergency-stop-button--operational";
      text = "Emergency Stop"
    }
  } else {
    className += " emergency-stop-button--disabled";
    text = "Emergency Stop"
  }

  return (
    <div className={className}>
      <button onClick={handleClick}>{text}</button>
    </div>
  );
}

export default EmergencyStopButton;
