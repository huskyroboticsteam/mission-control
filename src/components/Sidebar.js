import ConnectionInfo from "./ConnectionInfo";
import NavBar from "./NavBar";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <NavBar />
      <ConnectionInfo connected={false} />
    </div>
  );
}

export default Sidebar;
