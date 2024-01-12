import { NavLink } from "react-router-dom";
import ScienceIcon from "@mui/icons-material/Science";
import DeliveryIcon from "@mui/icons-material/Terrain";
import ServicingIcon from "@mui/icons-material/Build";
import AutonomousIcon from "@mui/icons-material/Code";
import TelemetryIcon from "@mui/icons-material/Info";
import AntennaIcon from "@mui/icons-material/SettingsInputAntenna";
import HelpIcon from "@mui/icons-material/Help";
import LoggingIcon from "@mui/icons-material/Computer"
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink 
            to="/science" 
            className={({ isActive}) => isActive ? "active" : "inactive"}
          >
            <ScienceIcon fontSize="large" className="navbar__icon" />
            Science
          </NavLink>
        </li>

        <li>
        <NavLink 
            to="/delivery" 
            className={({ isActive}) => isActive ? "active" : "inactive"}
          >
            <DeliveryIcon fontSize="large" className="navbar__icon" />
            Delivery
          </NavLink>
        </li>

        <li>
        <NavLink 
            to="/servicing" 
            className={({ isActive}) => isActive ? "active" : "inactive"}
          >
            <ServicingIcon fontSize="large" className="navbar__icon" />
            Servicing
          </NavLink>
        </li>

        <li>
        <NavLink 
            to="/autonomous" 
            className={({ isActive}) => isActive ? "active" : "inactive"}
          >
            <AutonomousIcon fontSize="large" className="navbar__icon" />
            Autonomous
          </NavLink>
        </li>

        <li>
        <NavLink 
            to="/telemetry" 
            className={({ isActive}) => isActive ? "active" : "inactive"}
          >
            <TelemetryIcon fontSize="large" className="navbar__icon" />
            Telemetry
          </NavLink>
        </li>

        <li>
        <NavLink 
            to="/antenna" 
            className={({ isActive}) => isActive ? "active" : "inactive"}
          >
            <AntennaIcon fontSize="large" className="navbar__icon" />
            Antenna
          </NavLink>
        </li>

        <li>
        <NavLink 
            to="/help" 
            className={({ isActive}) => isActive ? "active" : "inactive"}
          >
            <HelpIcon fontSize="large" className="navbar__icon" />
            Help
          </NavLink>
        </li>

        <li>
        <NavLink 
            to="/logging" 
            className={({ isActive}) => isActive ? "active" : "inactive"}
          >
            <LoggingIcon fontSize="large" className="navbar__icon" />
            Logging
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
