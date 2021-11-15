import { useState } from "react";
import "./Sidebar.css";
import SidebarNavItem from "./SidebarNavItem";
import ConnectionInfo from "./ConnectionInfo";

const NAV_ITEM_LABELS = ["Main", "Arm", "Camera", "Map"]

function Sidebar() {
  const [selectedItem, setSelectedItem] = useState("Main");

  const navItems = NAV_ITEM_LABELS.map(label => {
    return (
      <SidebarNavItem
        key={label}
        label={label}
        selected={selectedItem === label}
        setSelectedItem={setSelectedItem} />
    );
  });

  return (
    <div className="sidebar">
      <div className="sidebar__nav">
        {navItems}
      </div>
      <ConnectionInfo connected={false} />
    </div>
  );
}

export default Sidebar;
