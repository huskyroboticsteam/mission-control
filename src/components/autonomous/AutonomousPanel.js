import OpModeSelect from "./OpModeSelect";
import CameraStream from "../camera/CameraStream";
import "./AutonomousPanel.css";

function AutonomousPanel() {
  return (
    <div className="autonomous-panel">
      <OpModeSelect />
      <CameraStream cameraName={"front"} />
      <CameraStream cameraName={"rear"} />
    </div>
  );
}

export default AutonomousPanel;