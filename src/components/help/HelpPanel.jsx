import "./HelpPanel.css";
import KeyboardMapping from "../input/KeyboardMapping";
import ControllerMapping from "../input/ControllerMapping";

function HelpPanel() {
  return (
    <div className="help-panel">
      <div className="keyboard-mapping">
        <ControllerMapping />
      </div>
      <div className="keyboard-mapping">
        <KeyboardMapping />
      </div>
    </div>
  );
}

export default HelpPanel;
