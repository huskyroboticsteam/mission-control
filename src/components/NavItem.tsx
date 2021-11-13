import React from 'react';

interface NavItemProps {
  label: string;
  isSelected: boolean;
  selectItem(item: string): void;
}

interface NavItemState {
  hovered: boolean;
}

class NavItem extends React.Component<NavItemProps, NavItemState> {
  render() {
    const handleMouseEnter = () => {
      this.setState({ hovered: true });
    };

    const handleMouseLeave = () => {
      this.setState({ hovered: false });
    };

    const handleClick = () => this.props.selectItem(this.props.label);

    let className = "nav-item";
    if (this.props.isSelected) {
      className += " bg-primary";
    } else {
      className += " bg-secondary";
    }

    return (
      <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} className={className}>
        {this.props.label}
      </li>
    );
  }
}

export default NavItem;
