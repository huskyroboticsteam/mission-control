import React from "react";
import "./ConnectionInfo.css";
import SignalCellularAltIcon from "@material-ui/icons/SignalCellularAlt";

function ConnectionInfo(props: { connected: boolean; }) {
  if (props.connected) {
    return (
      <div className="connectionInfo connectionInfo--connected">
        <SignalCellularAltIcon
          className="connectionInfo__icon"
          fontSize="large"
        />
        <p>Connected to rover</p>
      </div>
    );
  } else {
    return (
      <div className="connectionInfo connectionInfo--disconnected">
        <SignalCellularAltIcon
          className="connectionInfo__icon"
          fontSize="large"
        />
        <p>Disconnected from rover</p>
      </div>
    );
  }
}

export default ConnectionInfo;
