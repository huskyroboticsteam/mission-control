import React from "react";
import { useSelector } from "react-redux";
import { selectRoverPosition } from "../../store/telemetrySlice";
import "./Compass.css";

const Compass = () => {
  const { orientW, orientX, orientY, orientZ } = useSelector(selectRoverPosition);
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

  const magnitude = Math.sqrt(roll**2 + pitch**2) / (Math.sqrt(180**2 + 180**2));

  let needleColor;
  if ( (magnitude  < 0.25) ) {
    needleColor = "green";
  } else if ( (magnitude < 0.5) ) {
    needleColor = "yellow";
  } else {
    needleColor = "red";
  }

  return (
      <div className="compass">
        <div className={`compass__needle compass__needle--${needleColor}`} style={{ transform: `rotate(${direction}deg)` }}></div>
        <div className="compass__label compass__label--north">N</div>
        <div className="compass__label compass__label--south">S</div>
        <div className="compass__label compass__label--west">W</div>
        <div className="compass__label compass__label--east">E</div>
      </div>
  );
};

export default Compass;
