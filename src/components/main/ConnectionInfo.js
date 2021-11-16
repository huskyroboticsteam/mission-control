import "./ConnectionInfo.css";
import SignalCellularAltIcon from "@material-ui/icons/SignalCellularAlt";

function ConnectionInfo({ connected }) {
  if (connected) {
    return (
      <div className="connectionInfo--connected">
        <SignalCellularAltIcon fontSize="large" />
        <p>Connected to rover</p>
      </div>
    );
  } else {
    return (
      <div className="connectionInfo--disconnected">
        <SignalCellularAltIcon fontSize="large" />
        <p>Disconnected from rover</p>
      </div>
    );
  }
}

export default ConnectionInfo;
