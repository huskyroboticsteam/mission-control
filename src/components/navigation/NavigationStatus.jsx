import { useSelector } from "react-redux";
import { selectRoverPosition } from "../../store/telemetrySlice";
import { selectLatitude, selectLongitude } from "../../store/waypointNavSlice";
import "./NavigationStatus.css";

// Constants for navigation
const POSITION_THRESHOLD = 0.5;
const APPROACHING_THRESHOLD = 3.0;

function calculateDistance(lat1, lon1, lat2, lon2) {
    const latDiff = Math.abs(lat1 - lat2);
    const lonDiff = Math.abs(lon1 - lon2);
    return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
}

function sanitize(num, decimals) {
    if (num == null) {
        return "N/A";
    }
    let ret = num.toString();
    if (decimals !== undefined) {
        ret = num.toFixed(decimals);
    }
    return num >= 0 ? " " + ret : ret;
}

function NavigationStatus() {
    const { lon, lat } = useSelector(selectRoverPosition);
    const targetLatitude = useSelector(selectLatitude);
    const targetLongitude = useSelector(selectLongitude);

    const getNavigationStatus = () => {
        // Guard against null or undefined values
        if (!lon || !lat || !targetLatitude || !targetLongitude) {
            return {
                status: "unknown",
                distance: null,
                color: "gray"
            };
        }

        const distance = calculateDistance(lat, lon, targetLatitude, targetLongitude);

        if (distance <= POSITION_THRESHOLD) {
            return {
                status: "reached",
                distance,
                color: "green"
            };
        } else if (distance <= APPROACHING_THRESHOLD) {
            return {
                status: "approaching",
                distance,
                color: "yellow"
            };
        } else {
            return {
                status: "navigating",
                distance,
                color: "red"
            };
        }
    };

    const navStatus = getNavigationStatus();

    return (
        <div className={`nav-status nav-status--${navStatus.color}`}>
            <div className="nav-status__header">Navigation Status</div>
            <div className="nav-status__content">
                <div>Status: <span className={`nav-status__label--${navStatus.color}`}>{navStatus.status}</span></div>
                <div>Distance: {navStatus.distance ? navStatus.distance.toFixed(6) : 'N/A'}</div>
                <div className="nav-status__coordinates">
                    <div>Current: ({sanitize(lat, 6)}, {sanitize(lon, 6)})</div>
                    <div>Target: ({sanitize(targetLatitude, 6)}, {sanitize(targetLongitude, 6)})</div>
                </div>
            </div>
        </div>
    );
}

export default NavigationStatus;