import React from "react";
import "./style.css";
import { Input, Icon, Button, Form } from "semantic-ui-react";
export const SearchFrame = () => {
  return (
    <div className="SearchFrame">
      <div className="SearchControls">
        <Input fluid icon placeholder="Search...">
          <input />
          <Icon name="search" />
        </Input>
      </div>
    </div>
  );
};
