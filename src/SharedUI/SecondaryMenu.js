import React from "react";
import { Menu, Divider, Input } from "semantic-ui-react";

export const SecondaryMenu = props => {
  const menuItems = props.menuItems.map(menuItem => (
    <Menu.Item
      name={menuItem}
      active={props.activeItem === menuItem}
      onClick={props.handleClick}
      key={menuItem}
    />
  ));
  const searchField = props.useSearch ? (
    <Menu.Menu position="right">
      <Menu.Item>
        <Input size="small" icon="search" placeholder="Search..." onChange={(e, val) => props.searchOutput(val.value)}/>
      </Menu.Item>
    </Menu.Menu>
  ) : null;

  return (
    <div style={{ marginTop: 15 }}>
      <Menu secondary>
        {menuItems}
        {searchField}
      </Menu>
      <Divider />
    </div>
  );
};
