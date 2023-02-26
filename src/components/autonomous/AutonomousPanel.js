import OpModeSelect from "./OpModeSelect";
import WaypointNav from "./WaypointNav";
import PlanViz from "../planViz/PlanVis";
import CameraStream from "../camera/CameraStream";
import "./AutonomousPanel.css";

function AutonomousPanel() {
  return (
    <div className="autonomous-panel">
      <OpModeSelect />
      <WaypointNav />
      <PlanViz />
      <CameraStream cameraName={"front"} />
      <CameraStream cameraName={"rear"} />
    </div>
  );
}

export default AutonomousPanel;
