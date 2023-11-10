import OpModeSelect from "./OpModeSelect";
import WaypointNav from "./WaypointNav";
import CameraStream from "../camera/CameraStream";
import "./AutonomousPanel.css";

function AutonomousPanel() {
  return (
    <div className="autonomous-panel">
      <OpModeSelect />
      <WaypointNav />
      <CameraStream cameraName={"front"} />
      <CameraStream cameraName={"rear"} />
    </div>
  );
}

export default AutonomousPanel;
