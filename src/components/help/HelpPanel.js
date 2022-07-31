import "./HelpPanel.css";
import standardDriveControls from "./standardDriveControls.png";
import tankDriveControls from "./tankDriveControls.png";
import armControls from "./armControls.png";

function HelpPanel() {
  return (
    <div className="help-panel">
      <img src={standardDriveControls} alt="standard drive controls" />
      <img src={tankDriveControls} alt="tank drive controls" />
      <img src={armControls} alt="arm controls" />
    </div>
  );
}

export default HelpPanel;
