import "./HelpPanel.css";
import driverControls from "../../assets/controls.jpg";

function HelpPanel() {
  return (
    <div className="help-panel">
      <img src={driverControls} alt="driver gamepad controls" />
      <img src={driverControls} alt="driver gamepad controls" />
      <img src={driverControls} alt="driver gamepad controls" />
    </div>
  );
}

export default HelpPanel;
