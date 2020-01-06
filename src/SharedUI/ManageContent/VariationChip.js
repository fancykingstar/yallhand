import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { inject, observer } from "mobx-react";
import { generateID } from "../../SharedCalculations/GenerateID"

@inject( "UIStore")
@observer
export default class VariationChip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null
    }
  }

  handleClick = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorEl: null});
  };

  EditVariation = () => {
    this.setState({anchorEl: null});
    this.props.edit();
  }

  DuplicateVariation = () => {
    this.setState({anchorEl: null});
    this.props.dupe();
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
            <MenuItem onClick={this.DuplicateVariation}>Create Duplicate</MenuItem>
          </Menu>
      </div>
    );
  }
}