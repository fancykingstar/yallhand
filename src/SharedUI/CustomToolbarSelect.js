import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import DeleteIcon from "@material-ui/icons/Delete";
import ArchiveIcon from '@material-ui/icons/Archive';
import FilterIcon from "@material-ui/icons/FilterList";
import { withStyles } from "@material-ui/core/styles";

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
    fontSize: "1rem",
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    fontWeight: "400",
    lineHeight: "1.75",
    letterSpacing: "0.00938em",
    color: "rgba(0, 0, 0, 0.87)",
  }
};

class CustomToolbarSelect extends React.Component {
    
  handleClick(val){
    this.props.handleClick(val, this.props.selectedRows)
  };

  hasPublished(){
      const selectedKeys = Object.keys(this.props.selectedRows.lookup);
      const selectedContent = this.props.data.filter((content,i)=> selectedKeys.includes(String(i)));
      return Boolean(selectedContent.filter(i=>i.everPublished).length);
  }

  hasFeatured(){
    const selectedKeys = Object.keys(this.props.selectedRows.lookup);
    const selectedContent = this.props.data.filter((content,i)=> selectedKeys.includes(String(i)));
    return Boolean(selectedContent.filter(i=>i.featured).length);
  }



  render() {
    const { classes } = this.props;

    return (
      <div className={"custom-toolbar-select"}>
        <Tooltip title={this.hasFeatured()? "Remove Feature":"Feature" }>
          <label className={classes.iconStyle} onClick={()=> this.handleClick(this.hasFeatured()? "remove feature":"feature")}>
           {/*{this.hasFeatured()?  <StarBorderIcon className={classes.starIcon} />: <StarIcon className={classes.starIcon} />}*/}
           {this.hasFeatured()?  <span className={classes.featured}>Feature</span>: <span className={classes.featured}>Feature</span>}
          </label>
        </Tooltip>
        {/* <Tooltip title={this.hasPublished()? "Archive":"Delete"}>
          <IconButton className={classes.iconStyle} onClick={()=>this.handleClick("archive")}>
           {this.hasPublished()? <ArchiveIcon className={classes.archiveIcon} /> :   <DeleteIcon className={classes.deleteIcon} />}
          </IconButton>
        </Tooltip> */}
       
      </div>
    );
  }
}

export default withStyles(defaultToolbarSelectStyles, {
  name: "CustomToolbarSelect"
})(CustomToolbarSelect);
