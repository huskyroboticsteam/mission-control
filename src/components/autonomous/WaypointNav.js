import { useDispatch, useSelector } from "react-redux";
import { selectLatitude, selectLongitude, selectIsApproximate, selectIsGated, requestWaypointNav } from "../../store/waypointNavSlice";
import { selectOpMode } from "../../store/opModeSlice";
import "./WaypointNav.css";

function WaypointNav() {
  const dispatch = useDispatch();

  var latitudeGiven = useSelector(selectLatitude);
  var longitudeGiven = useSelector(selectLongitude);
  var isApproximate = useSelector(selectIsApproximate);
  var isGated = useSelector(selectIsGated);
  const opMode = useSelector(selectOpMode);

  const handleClick = () => {
    updateLatitude();
    updateLongitude();
    updateIsApproximate();
    updateIsGate();

    // Only send the event in autonomous mode
    if (opMode === "autonomous") {
        dispatch(requestWaypointNav({ latitude: latitudeGiven,
                                      longitude: longitudeGiven,
                                      approximate: isApproximate,
                                      gated: isGated}));
    }

    return false;
  };

  const updateLatitude = () => {
    latitudeGiven = document.getElementById('latitude').value;
  };

  const updateLongitude = () => {
    longitudeGiven = document.getElementById('longitude').value;
  };

  const updateIsApproximate = () => {
    isApproximate = document.getElementById('isApproximate').checked;
  };


  const updateIsGate = () => {
    isGated = document.getElementById('isGate').checked;
  };

  let button;
  if (opMode === "autonomous") {
    button = <button type="button" onClick={handleClick}>Go</button>
  } else {
    button = <button disabled>Go</button>
  }
// move longitude down, move checkboxes togethers
  return (<form className="waypoint-select">
    <div className="waypoint-select__params">
      <label for="latitude">Latitude</label>
      <input type="number" id="latitude" placeholder="Latitude" />
      <label for="longitude">Longitude</label>
      <input type="number" id="longitude" placeholder="Longitude" />
      <div className="waypoint-checkbox">
        <div>
          <input type="checkbox" id="isApproximate" />
          <label for="isApproximate"> Approximate</label>
        </div>
        <div>
          <input type="checkbox" id="isGate" />
          <label for="isGate"> Is Gate</label>
        </div>
      </div>
    </div>
    {button}
  </form>
  );
}

export default WaypointNav;
