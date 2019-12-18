import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { inject, observer } from "mobx-react";


@inject( "UIStore")
@observer
export default class VariationChip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: false
    }
  }

  handleClick = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorEl: null});
  };

  EditVariation = () => {
    const { UIStore } = this.props;
    this.setState({anchorEl: null});
    UIStore.set("content", "showTargeting", true);
  }

  render() {
    return (
      <div style={{marginRight: 5, marginBottom: 10}}>
          <Chip color="primary" label={this.props.label} onDelete={this.handleClick}  deleteIcon={<ExpandMoreIcon/>} />  
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.EditVariation}>Edit</MenuItem>
            <MenuItem onClick={this.EditVariation}>Create Duplicate</MenuItem>
          </Menu>
      </div>
    );
  }
}