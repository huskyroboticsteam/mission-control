import "./HelpPanel.css";
import driveGamepadControls from "./driveGamepadControls.png";

function HelpPanel() {
  return (
    <div className="help-panel">
      <img src={driveGamepadControls} alt="drive gamepad controls" />
      <img src={driveGamepadControls} alt="arm gamepad controls" />
      <img src={driveGamepadControls} alt="keyboard controls" />
    </div>
  );
}

export default HelpPanel;
