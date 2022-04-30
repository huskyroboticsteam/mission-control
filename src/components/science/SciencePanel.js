import ArmModel from "../armModel/ArmModel";
import CameraStream from "../camera/CameraStream";
import LazySusan from "../lazySusan/LazySusan";
import Syringe from "../syringe/Syringe";
import "./SciencePanel.css";

function SciencePanel() {
  return (
    <div className="science-panel">
      <Syringe/>
      <LazySusan/>
      <LazySusan/>
      <LazySusan/>
      <Syringe/>  
      <Syringe/>
    </div>
  );
}

export default SciencePanel;
