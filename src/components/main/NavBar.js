import { NavLink } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import ArmIcon from "@material-ui/icons/Phone";
import CameraIcon from "@material-ui/icons/CameraAlt";
import MapIcon from "@material-ui/icons/Map";
import ScienceIcon from "@material-ui/icons/Eco";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="navBar">
      <ul>
        <li>
          <NavLink to="/home" className="navBar__navLink" activeClassName="navBar__navLink--active">
            <HomeIcon className="navBar__icon" />
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/arm" className="navBar__navLink" activeClassName="navBar__navLink--active">
            <ArmIcon className="navBar__icon" />
            Arm
          </NavLink>
        </li>

        <li>
          <NavLink to="/camera" className="navBar__navLink" activeClassName="navBar__navLink--active">
            <CameraIcon className="navBar__icon" />
            Camera
          </NavLink>
        </li>

        <li>
          <NavLink to="/map" className="navBar__navLink" activeClassName="navBar__navLink--active">
            <MapIcon className="navBar__icon" />
            Map
          </NavLink>
        </li>

        <li>
          <NavLink to="/science" className="navBar__navLink" activeClassName="navBar__navLink--active">
            <ScienceIcon className="navBar__icon" />
            Science
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
