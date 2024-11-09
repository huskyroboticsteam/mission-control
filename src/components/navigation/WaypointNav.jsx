import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { requestWaypointNav } from "../../store/waypointNavSlice";
import { selectOpMode } from "../../store/opModeSlice";
import { 
  selectNavigationStatus, 
  selectDistanceToTarget, 
  selectNavigationError 
} from "../../store/navigationStatusSlice";
import "./WaypointNav.css";

function WaypointNav() {
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    latitude: 0,
    longitude: 0,
    isApproximate: false,
    isGate: false
  });

  const navStatus = useSelector(selectNavigationStatus);
  const distanceToTarget = useSelector(selectDistanceToTarget);
  const navError = useSelector(selectNavigationError);
  const opMode = useSelector(selectOpMode);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    dispatch(requestWaypointNav(formData));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseFloat(value) || 0
    }));
  };

  const grabFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const coordRegex = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
      
      if (coordRegex.test(text)) {
        const [lat, lon] = text.split(',').map(coord => parseFloat(coord.trim()));
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lon
        }));
      } else {
        alert("Clipboard contents do not match expected format 'lat, lon'!");
      }
    } catch (err) {
      console.error("Failed to read clipboard contents:", err);
      alert("Failed to read clipboard contents! (Make sure to allow clipboard access)");
    }
  };

  useEffect(() => {
    if (opMode === "teleoperation") {
      setSubmitted(false);
    }
  }, [opMode]);

  return (
    <div>
      <form onSubmit={handleSubmit} className="waypoint-select">
        <div className="waypoint-select__params">
          <label htmlFor="latitude">Latitude</label>
          <input
            type="number"
            step="any"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
            disabled={submitted}
          />
          
          <label htmlFor="longitude">Longitude</label>
          <input
            type="number"
            step="any"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            disabled={submitted}
          />
          
          <button 
            type="button" 
            onClick={grabFromClipboard}
            disabled={submitted}
          >
            Copy from Clipboard
          </button>
        </div>

        <div className="waypoint-checkbox">
          <label>
            <input
              type="checkbox"
              name="isApproximate"
              checked={formData.isApproximate}
              onChange={handleInputChange}
              disabled={submitted}
            />
            Approximate
          </label>
          
          <label>
            <input
              type="checkbox"
              name="isGate"
              checked={formData.isGate}
              onChange={handleInputChange}
              disabled={submitted}
            />
            Is Gate
          </label>
        </div>

        <button 
          type="submit" 
          disabled={submitted || opMode !== "autonomous"}
        >
          Go
        </button>
      </form>

      {navStatus && (
        <div className={`waypoint-status waypoint-status--${navStatus}`}>
          <div className="status-info">
            <span>Navigation Status: {navStatus}</span>
            {distanceToTarget !== null && (
              <span>Distance Remaining: {distanceToTarget.toFixed(2)}m</span>
            )}
          </div>
          {navError && (
            <div className="status-error">{navError}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default WaypointNav;