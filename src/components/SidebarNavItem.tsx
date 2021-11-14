import React from "react";
import "./SidebarNavItem.css";

function SidebarNavItem(props: { label: string; selected: boolean; }) {
  let className = "sidebarNavItem";
  if (props.selected) {
    className += " sidebarNavItem--selected";
  } else {
    className += " sidebarNavItem--unselected"
  }
  return (
    <div className={className}>
      <h2>{props.label}</h2>
    </div>
  );
}

export default SidebarNavItem;
