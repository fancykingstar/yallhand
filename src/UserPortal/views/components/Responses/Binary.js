import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

export class Binary extends React.Component {
    render(){
   
        const {negLabel, posLabel, thumbs} = this.props;
    return(
        <>
        <Fab
          variant="extended"
          size="small"
          color="secondary"
          aria-label="add"
          onClick={()=>this.props.output(0)}
        >
            {thumbs? <ThumbDownIcon /> :negLabel}
        </Fab>{" "}
        <Fab
          variant="extended"
          size="small"
          color="primary"
          aria-label="add"
          onClick={()=>this.props.output(1)}
        >
            {thumbs? <ThumbUpIcon />: posLabel}
        </Fab>
      </>
    )
    }
}

