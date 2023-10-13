import { useDispatch, useSelector } from "react-redux";
import { requestWaypointNav } from "../../store/waypointNavSlice";
import { selectOpMode } from "../../store/opModeSlice";
import "./WaypointNav.css";

function WaypointNav() {
  const dispatch = useDispatch();
  var opMode = useSelector(selectOpMode);

  function handleSubmit (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    // Only send the event in autonomous mode
    if (opMode === "autonomous") {
        console.log(formJson);
        dispatch(requestWaypointNav(formJson));
    }
  };
  
// move longitude down, move checkboxes togethers
  return (
  <form method="post" onSubmit={handleSubmit} className="waypoint-select"> 
    <div className="waypoint-select__params">
      <label for="latitude">Latitude</label>
      <input type="number" name="latitude" placeholder="Latitude" />
      <label for="longitude">Longitude</label>
      <input type="number" name="longitude" placeholder="Longitude" />
      <div className="waypoint-checkbox">
        <div>
          <label> <input type="checkbox" name="isApproximate" /> Approximate</label>
        </div>
        <div>
          <label> <input type="checkbox" name="isGate" /> Is Gate</label>
        </div>
      </div>
    </div>
    {opMode === "autonomous" ? <button type="submit">Go</button> : <buttonDisabled disabled>Go</buttonDisabled>}
  </form>
  );
}

export default WaypointNav;
