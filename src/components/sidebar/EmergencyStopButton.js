import "./EmergencyStopButton.css";

function EmergencyStopButton({ roverConnected, stopEngaged, setStopEngaged }) {
  const handleClick = () => {
    if (roverConnected) {
      setStopEngaged(!stopEngaged);
    }
  };

  let className = "emergencyStopButton";
  let text;
  if (roverConnected) {
    if (stopEngaged) {
      className += " emergencyStopButton--stopped";
      text = "Resume"
    } else {
      className += " emergencyStopButton--operational";
      text = "Emergency Stop"
    }
  } else {
    className += " emergencyStopButton--disabled";
    text = "Emergency Stop"
  }

  return (
    <div className={className}>
      <button onClick={handleClick}>{text}</button>
    </div>
  );
}

export default EmergencyStopButton;
