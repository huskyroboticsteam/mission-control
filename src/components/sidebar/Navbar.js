import { NavLink } from "react-router-dom";
import DeliveryIcon from "@material-ui/icons/Terrain";
import ServicingIcon from "@material-ui/icons/Build";
import AutonomousIcon from "@material-ui/icons/Code";
import TelemetryIcon from "@material-ui/icons/Info";
import HelpIcon from "@material-ui/icons/Help";
import LoggingIcon from "@material-ui/icons/Computer"
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
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
