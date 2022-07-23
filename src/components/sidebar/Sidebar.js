import Navbar from "./Navbar";
import EmergencyStopButton from "./EmergencyStopButton";
import EnableMotorsButton from "./EnableMotorsButton";
import InputInfo from "./InputInfo";
import ConnectionInfo from "./ConnectionInfo";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <Navbar />
      <EmergencyStopButton />
      <EnableMotorsButton />
      <InputInfo />
      <ConnectionInfo />
    </div>
  );
}

export default Sidebar;
