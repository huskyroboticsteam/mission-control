import React from "react";
import "./Sidebar.css";
import SidebarNavItem from "./SidebarNavItem";
import ConnectionInfo from "./ConnectionInfo";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__nav">
        <SidebarNavItem label="Main" selected={true} />
        <SidebarNavItem label="Arm" selected={false} />
        <SidebarNavItem label="Camera" selected={false} />
        <SidebarNavItem label="Map" selected={false} />
      </div>
      <ConnectionInfo connected={false} />
    </div>
  );
}

export default Sidebar;
