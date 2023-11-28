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
          <NavLink to="/science" className="navbar__nav-link" activeClassName="navbar__nav-link--active">
            <ScienceIcon fontSize="large" className="navbar__icon" />
            Science
          </NavLink>
        </li>

        <li>
          <NavLink to="/delivery" className="navbar__nav-link" activeClassName="navbar__nav-link--active">
            <DeliveryIcon fontSize="large" className="navbar__icon" />
            Delivery
          </NavLink>
        </li>

        <li>
          <NavLink to="/servicing" className="navbar__nav-link" activeClassName="navbar__nav-link--active">
            <ServicingIcon fontSize="large" className="navbar__icon" />
            Servicing
          </NavLink>
        </li>

        <li>
          <NavLink to="/autonomous" className="navbar__nav-link" activeClassName="navbar__nav-link--active">
            <AutonomousIcon fontSize="large" className="navbar__icon" />
            Autonomous
          </NavLink>
        </li>

        <li>
          <NavLink to="/telemetry" className="navbar__nav-link" activeClassName="navbar__nav-link--active">
            <TelemetryIcon fontSize="large" className="navbar__icon" />
            Telemetry
          </NavLink>
        </li>

        <li>
          <NavLink to="/antenna" className="navbar__nav-link" activeClassName="navbar__nav-link--active">
            <AntennaIcon fontSize="large" className="navbar__icon" />
            Antenna
          </NavLink>
        </li>

        <li>
          <NavLink to="/help" className="navbar__nav-link" activeClassName="navbar__nav-link--active">
            <HelpIcon fontSize="large" className="navbar__icon" />
            Help
          </NavLink>
        </li>

        <li>
          <NavLink to="/logging" className="navbar__nav-link" activeClassName="navbar__nav-link--active">
            <LoggingIcon fontSize="large" className="navbar__icon" />
            Logging
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
