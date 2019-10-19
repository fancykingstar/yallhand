import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

export class Binary extends React.Component {
    constructor(props){
      super(props);
      this.state={selected: null};
    }

    handleClick(val){
      this.setState({selected: val});
      this.props.output(val);
    }

    render(){
   
        const {negLabel, posLabel, thumbs} = this.props;
        const {selected} = this.state;
    return(
        <div>
        <Fab
          variant="extended"
          size="small"
          color={selected === null || !selected? "secondary" : "default"}
          aria-label="add"
          onClick={()=>this.handleClick(0)}
          style={{margin: "0 15px 0"}}
        >
            {thumbs? <ThumbDownIcon /> :negLabel}
        </Fab>
        <Fab
          variant="extended"
          size="small"
          color={selected === null || selected? "primary" : "default"}
          aria-label="add"
          onClick={()=>this.handleClick(1)}
          style={{margin: "0 15px 0"}}
        >
            {thumbs? <ThumbUpIcon />: posLabel}
        </Fab>
      </div>
    )
    }
}

