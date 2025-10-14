import Map from "../map/Map";
import OpModeSelect from "./OpModeSelect";
import WaypointNav from "./WaypointNav";
import CameraStream from "../camera/CameraStream";
import "./AutonomousPanel.css";

function AutonomousPanel() {
  return (
    <div className="autonomous-panel">
      <Map />
      <OpModeSelect />
      <WaypointNav />
      <CameraStream cameraName={"front"} />
      <CameraStream cameraName={"rear"} />
    </div>
  );
}

export default AutonomousPanel;
