import "./HelpView.css";
import driverControls from "../../assets/controls.jpg";

function HelpView() {
  return (
    <div className="helpView">
      <img src={driverControls} alt="driver gamepad controls" />
      <img src={driverControls} alt="driver gamepad controls" />
      <img src={driverControls} alt="driver gamepad controls" />
    </div>
  );
}

export default HelpView;
