import "./HelpPanel.css";
import standardDriveControls from "./standardDriveControls.png";
import tankDriveControls from "./tankDriveControls.png";
import armControls from "./armControls.png";
import KeyboardMapping from "../input/KeyboardMapping";

function HelpPanel() {
  return (
    <div className="help-panel">
      <div className="controls-images">
        <img src={standardDriveControls} alt="standard drive controls" />
        <img src={tankDriveControls} alt="tank drive controls" />
        <img src={armControls} alt="arm controls" />
      </div>

      <div className="keyboard-mapping">
        <h3>Keyboard Controls</h3>
        <KeyboardMapping />
      </div>
    </div>
  );
}

export default HelpPanel;
