import React from "react";
import { connect } from "react-redux";

const Compass = (props) => {
  const { orientW, orientX, orientY, orientZ } = props;
  // Calculate the direction based on the quaternion values
  const direction = Math.round(
    (Math.atan2(
      2 * (orientW * orientZ + orientX * orientY),
      1 - 2 * (orientY * orientY + orientZ * orientZ)
    ) *
      180) /
      Math.PI
  );

  const roll = Math.round(
    (Math.atan2(
      2 * (orientW * orientX + orientY * orientZ),
      1 - 2 * (orientX * orientX + orientY * orientY)
    ) *
      180) /
      Math.PI
  );
  
  const pitch = Math.round(
    2 * (Math.atan2(
      Math.sqrt(1 + 2 * (orientW * orientY - orientX * orientZ)),
      Math.sqrt(1 - 2 * (orientW * orientY - orientX * orientZ))
    )
    ) - Math.PI / 2
  );
  let needleColor = "black";
  if ( (roll >= -45 && roll <= 45) || (pitch >= -45 && pitch <= 45) ) {
    needleColor = "green";
  } else if ( (roll > 45 && roll <= 135) || (pitch > 45 && pitch <= 135) ) {
    needleColor = "yellow";
  } else {
    needleColor = "red";
  }

  return (
    <div
      style={{
        width: "100px",
        height: "100px",
        backgroundColor: "white",
        borderRadius: "50%",
        position: "fixed",
        top: "0",
        right: "0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          width: "4px",
          height: "50%",
          backgroundColor: needleColor,
          position: "absolute",
          top: "25%",
          left: "48%",
          transform: `rotate(${direction}deg)`,
          transformOrigin: "center",
          borderRadius: "100% 100% 100% 100%"
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "50%",
          color: "black",
          transform: "translateX(-50%)",
          fontSize: "12px"
        }}
      >
        N
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          color: "black",
          transform: "translateX(-50%)",
          fontSize: "12px"
        }}
      >
        S
      </div>
      <div
        style={{
          position: "absolute",
          left: "0",
          top: "50%",
          color: "black",
          transform: "translateY(-50%)",
          fontSize: "12px"
        }}
      >
        W
      </div>
      <div
        style={{
          position: "absolute",
          right: "0",
          top: "50%",
          color: "black",
          transform: "translateY(-50%)",
          fontSize: "12px"
        }}
      >
        E
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    orientW: state.telemetry.orientW,
    orientX: state.telemetry.orientX,
    orientY: state.telemetry.orientY,
    orientZ: state.telemetry.orientZ
  };
};


export default connect(mapStateToProps)(Compass);
