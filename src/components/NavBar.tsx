import React from 'react';
import NavItem from './NavItem';

const ITEMS = ["Main", "Arm"];

interface NavBarProps {
}

interface NavBarState {
  selectedItem: string;
}

class NavBar extends React.Component<NavBarProps, NavBarState> {
  constructor(props: NavBarProps) {
    super(props);
    this.state = { selectedItem: ITEMS[0] };
  }

  render() {
    const selectItemCallback = (item: string) => {
      this.setState({ selectedItem: item });
    };

    const navItems = ITEMS.map((item => {
      return <NavItem label={item} isSelected={this.state.selectedItem === item} selectItem={selectItemCallback} key={item} />;
    }));

    return (
      <nav id="nav-bar">
        <ul className="nav flex-column">
          {navItems}
        </ul>
      </nav>
    );
  }
}

export default NavBar;
