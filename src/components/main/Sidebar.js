import NavBar from "./NavBar";
import InputInfo from "./InputInfo";
import ConnectionInfo from "./ConnectionInfo";
import "./Sidebar.css";

function Sidebar({ roverConnected, gamepad1Connected, gamepad2Connected }) {
  return (
    <div className="sidebar">
      <NavBar />

      {/* The keyboard should always be connected. */}
      <InputInfo
        keyboardConnected={true}
        gamepad1Connected={gamepad1Connected}
        gamepad2Connected={gamepad2Connected} />
      < ConnectionInfo roverConnected={roverConnected} />
    </div>
  );
}

export default Sidebar;
