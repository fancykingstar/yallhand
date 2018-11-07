import React from "react";
import { Icon } from "semantic-ui-react";
import "./style.css";

export class BackToChan extends React.Component {
  static contextTypes = {
    router: () => true
  };
  render() {
    return (
      <Icon
        name="arrow circle left"
        color="blue"
        size="large"
        onClick={this.context.router.history.goBack}
      />
    );
  }
}
