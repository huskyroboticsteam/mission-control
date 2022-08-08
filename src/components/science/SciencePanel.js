import Syringe from "../syringe/Syringe";
import LazySusan from "../lazySusan/LazySusan";
import Sensors from "../sensors/Sensors";
import CameraStream from "../camera/CameraStream";
import "./SciencePanel.css";

function SciencePanel() {
  return (
    <div className="science-panel">
      <Syringe />
      <LazySusan />
      <Sensors />
      <CameraStream cameraName="front" />
      <CameraStream cameraName="panoramic" />
      <CameraStream cameraName="microscope" />
    </div>
  );
}

export default SciencePanel;
