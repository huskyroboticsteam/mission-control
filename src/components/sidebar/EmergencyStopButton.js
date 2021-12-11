import { useDispatch, useSelector } from "react-redux";
import { emergencyStopRequested, selectEmergencyStopEngaged } from "../../store/roverSlice";
import "./EmergencyStopButton.css";

function EmergencyStopButton() {
  const dispatch = useDispatch();
  const stopEngaged = useSelector(selectEmergencyStopEngaged);

  const handleClick = () => {
    dispatch(emergencyStopRequested({ stop: !stopEngaged }));
  };

  let className = "emergency-stop-button emergency-stop-button--" +
    (stopEngaged ? "stopped" : "operational");
  const text = stopEngaged ? "Disgengage Stop" : "Emergency Stop";

  return (
    <div className={className}>
      <button onClick={handleClick}>{text}</button>
    </div>
  );
}

export default EmergencyStopButton;
