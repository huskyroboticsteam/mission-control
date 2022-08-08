import CameraStream from "../camera/CameraStream";
import LazySusan from "../lazySusan/LazySusan";
import Syringe from "../syringe/Syringe";
import Sensors from "../sensors/Sensors";
import "./SciencePanel.css";

function SciencePanel() {
  return (
    <div className="science-panel">
      <Syringe/> 
      <LazySusan/>
      <CameraStream cameraName="panoramic"/>
      <CameraStream cameraName="microscope" />
      <Sensors/>
    </div>
  );
}

export default SciencePanel;
