import NavBar from "./Navbar";
import EmergencyStopButton from "./EmergencyStopButton";
import InputInfo from "./InputInfo";
import ConnectionInfo from "./ConnectionInfo";
import "./Sidebar.css";

function Sidebar({ roverConnected, stopEngaged, setStopEngaged, driveGamepadConnected, armGamepadConnected }) {
  return (
    <div className="sidebar">
      <NavBar />
      <EmergencyStopButton roverConnected={roverConnected} stopEngaged={stopEngaged} setStopEngaged={setStopEngaged} />
      {/* The keyboard should always be connected. */}
      <InputInfo
        keyboardConnected={true}
        driveGamepadConnected={driveGamepadConnected}
        armGamepadConnected={armGamepadConnected}
      />
      < ConnectionInfo roverConnected={roverConnected} />
    </div>
  );
}

export default Sidebar;
