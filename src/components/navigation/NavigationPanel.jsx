import Compass from "./Compass";
import OpModeSelect from "./OpModeSelect";
import CameraStream from "../camera/CameraStream";
import WaypointNav from "./WaypointNav";
import "./NavigationPanel.css"

function NavigationPanel() {
  return (
    <div className="navigation-panel">
      <CameraStream cameraName="front" />
      <CameraStream cameraName="rear" />
      <Compass />
      <OpModeSelect />
      <WaypointNav />
    </div>
  );
}

export default NavigationPanel;