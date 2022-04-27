import ArmModel from "../armModel/ArmModel";
import CameraStream from "../camera/CameraStream";
import LazySusan from "../lazySusan/LazySusan";
import Syringe from "../syringe/Syringe";
import "./SciencePanel.css";

function SciencePanel() {
  return (
    <div className="science-panel">
      <Syringe/>
      <CameraStream cameraName="rear" />
      <CameraStream cameraName="upperArm" />
      <LazySusan/>
      <CameraStream cameraName="upperArm"/>
    </div>
  );
}

export default SciencePanel;
