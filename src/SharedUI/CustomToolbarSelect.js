import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const defaultToolbarSelectStyles = {
  iconStyle: {

    display: "inline-block",
    position: "relative",
    transform: "translate(-10px, -40%)",
    top: "20px",
    color: "#8F8F8F",
    paddingBottom: "8px",
    cursor: "pointer"
  },
  featured: {
    fontSize: '1rem',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: '400',
    lineHeight: '1.75',
    letterSpacing: '0.00938em',
    color: 'rgba(0, 0, 0, 0.87)',
  },
};

class CustomToolbarSelect extends React.Component {
  handleClick(val) {
    const { handleClick, selectedRows } = this.props;
    handleClick(val, selectedRows);
  }

  hasPublished() {
    const { data, selectedRows } = this.props;
    const selectedKeys = Object.keys(selectedRows.lookup);
    const selectedContent = data.filter((content, i) => selectedKeys.includes(String(i)));
    return Boolean(selectedContent.filter(i => i.everPublished).length);
  }

  hasFeatured() {
    const { data, selectedRows } = this.props;
    const selectedKeys = Object.keys(selectedRows.lookup);
    const selectedContent = data.filter((content, i) => selectedKeys.includes(String(i)));
    return Boolean(selectedContent.filter(i => i.featured).length);
  }

  render() {
    const { classes } = this.props;
    const isFeatured = this.hasFeatured();

    return (

      <div className={"custom-toolbar-select"}>
        <Tooltip title={this.hasFeatured()? "Remove Feature":"Feature" }>
          <label className={classes.iconStyle} onClick={()=> this.handleClick(this.hasFeatured()? "remove feature":"feature")}>
           {/*{this.hasFeatured()?  <StarBorderIcon className={classes.starIcon} />: <StarIcon className={classes.starIcon} />}*/}
           {this.hasFeatured()?  <span className={classes.featured}>Feature</span>: <span className={classes.featured}>Feature</span>}
          </label>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(defaultToolbarSelectStyles, {
  name: 'CustomToolbarSelect',
})(CustomToolbarSelect);
