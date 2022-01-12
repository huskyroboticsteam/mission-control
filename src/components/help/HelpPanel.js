import "./HelpPanel.css";
import driveGamepadControls from "./driveGamepadControls.png";
import armGamepadControls from "./driveGamepadControls.png";
import keyboardControls from "./driveGamepadControls.png";

function HelpPanel() {
  return (
    <div className="help-panel">
      <img src={driveGamepadControls} alt="drive gamepad controls" />
      <img src={armGamepadControls} alt="arm gamepad controls" />
      <img src={keyboardControls} alt="keyboard controls" />
    </div>
  );
}

export default HelpPanel;
