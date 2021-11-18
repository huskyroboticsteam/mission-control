import NavBar from "./NavBar";
import EmergencyStopButton from "./EmergencyStopButton";
import InputInfo from "./InputInfo";
import ConnectionInfo from "./ConnectionInfo";
import "./Sidebar.css";

function Sidebar({ roverConnected, stopEngaged, setStopEngaged, gamepad1Connected, gamepad2Connected }) {
  return (
    <div className="sidebar">
      <NavBar />
      <EmergencyStopButton roverConnected={roverConnected} stopEngaged={stopEngaged} setStopEngaged={setStopEngaged} />
      {/* The keyboard should always be connected. */}
      <InputInfo
        keyboardConnected={true}
        gamepad1Connected={gamepad1Connected}
        gamepad2Connected={gamepad2Connected}
      />
      < ConnectionInfo roverConnected={roverConnected} />
    </div>
  );
}

export default Sidebar;
