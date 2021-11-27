import "./EmergencyStopButton.css";

function EmergencyStopButton({ roverConnected, stopEngaged, setStopEngaged }) {
  const handleClick = () => {
    if (roverConnected) {
      setStopEngaged(!stopEngaged);
    }
  };

  let className = "emergency-stop-button";
  let text;
  if (roverConnected) {
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
