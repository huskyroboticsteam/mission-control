import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { requestWaypointNav } from "../../store/waypointNavSlice";
import { selectOpMode } from "../../store/opModeSlice";
import "./WaypointNav.css";

function WaypointNav() {
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  var opMode = useSelector(selectOpMode);

  function handleSubmit (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    setSubmitted(true);
    dispatch(requestWaypointNav(formJson));
  };

  useEffect(() => {
    if (opMode === "teleoperation") {
      setSubmitted(false);
    }
  }, [opMode]);
  
  return (
  <form method="post" onSubmit={handleSubmit} className="waypoint-select"> 
    <div className="waypoint-select__params">
    <label for="latitude">Latitude</label>
    {submitted ? <input disabled type="number" name="latitude" placeholder="Latitude" /> : <input type="number" name="latitude" placeholder="Latitude" />}
      <label for="longitude">Longitude</label>
      {submitted ? <input disabled type="number" name="longitude" placeholder="Longitude" /> : <input type="number" name="longitude" placeholder="Longitude" />}
      <div className="waypoint-checkbox">
        <div>
          <label>{submitted ? <input disabled type="checkbox" name="isApproximate" /> : <input type="checkbox" name="isApproximate" />} Approximate</label>
        </div>
        <div>
          <label>{submitted ? <input disabled type="checkbox" name="isGate" />: <input type="checkbox" name="isGate" />} Is Gate</label>
        </div>
      </div>
    </div>
    {opMode === "autonomous" && !submitted ? <button type="submit">Go</button> : <button disabled>Go</button>}
  </form>
  );
}

export default WaypointNav;
