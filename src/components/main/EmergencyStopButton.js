import "./EmergencyStopButton.css";

function EmergencyStopButton({ stopped }) {
  if (stopped) {
    return (
      <div class="emergencyStopButton--stopped">
        <button></button>
      </div>
    );
  } else {
    return (
      <div class="emergencyStopButton--operational">
        <button></button>
      </div>
    );
  }
}

export default EmergencyStopButton;
