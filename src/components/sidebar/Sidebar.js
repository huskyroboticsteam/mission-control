import Navbar from "./Navbar";
import EmergencyStopButton from "./EmergencyStopButton";
import InputInfo from "./InputInfo";
import ConnectionInfo from "./ConnectionInfo";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <Navbar />
      <EmergencyStopButton />
      <InputInfo />
      <ConnectionInfo />
    </div>
  );
}

export default Sidebar;
