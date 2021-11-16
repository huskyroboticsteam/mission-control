import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="sidebar__nav">
      <ul>
        <li><NavLink to="/main" className="navBar__navLink" activeClassName="navBar__navLink--active">Main</NavLink></li>
        <li><NavLink to="/arm" className="navBar__navLink" activeClassName="navBar__navLink--active">Arm</NavLink></li>
        <li><NavLink to="/camera" className="navBar__navLink" activeClassName="navBar__navLink--active">Camera</NavLink></li>
        <li><NavLink to="/map" className="navBar__navLink" activeClassName="navBar__navLink--active">Map</NavLink></li>
      </ul>
    </nav>
  );
}

export default NavBar;
