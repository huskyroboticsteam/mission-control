import { NavLink } from "react-router-dom";
import ScienceIcon from "@material-ui/icons/Eco";
import DeliveryIcon from "@material-ui/icons/Terrain";
import ServicingIcon from "@material-ui/icons/Build";
import AutonomousIcon from "@material-ui/icons/Code";
import TelemetryIcon from "@material-ui/icons/Info";
import AntennaIcon from "@material-ui/icons/SettingsInputAntenna";
import HelpIcon from "@material-ui/icons/Help";
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
      </ul>
    </nav>
  );
}

export default Navbar;
