import React from "react";
import { Menu, Divider } from "semantic-ui-react";

export const SecondaryMenu = props => {
  const menuItems = props.menuItems.map(menuItem => (
    <Menu.Item
      name={menuItem}
      active={props.activeItem === menuItem}
      onClick={props.handleClick}
    />
  ));

  return (
    <div style={{ marginTop: 15 }}>
      <Menu secondary>{menuItems}</Menu>
      <Divider />
    </div>
  );
};
