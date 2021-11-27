import "./ConnectionInfo.css";
import ConnectionIcon from "@material-ui/icons/SignalCellularAlt";

function ConnectionInfo({ roverConnected }) {
  if (roverConnected) {
    return (
      <div className="connection-info connection-info--connected">
        <ConnectionIcon fontSize="large" />
        <p>Connected to rover</p>
      </div>
    );
  } else {
    return (
      <div className="connection-info connection-info--disconnected">
        <ConnectionIcon fontSize="large" />
        <p>Rover not connected</p>
      </div>
    );
  }
}

export default ConnectionInfo;
