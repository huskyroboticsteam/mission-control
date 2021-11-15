import "./SidebarNavItem.css";

function SidebarNavItem({ label, selected, setSelectedItem }) {
  let className = selected ? "sidebarNavItem--selected" : "sidebarNavItem--unselected";

  const onClick = () => {
    setSelectedItem(label);
  };

  return (
    <div className={className} onClick={onClick}>
      <h2>{label}</h2>
    </div>
  );
}

export default SidebarNavItem;
