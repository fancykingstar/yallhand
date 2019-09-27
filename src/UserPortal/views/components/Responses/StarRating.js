import React from "react";
import {Rating} from "semantic-ui-react";

export class StarRating extends React.Component {
    render(){
        const {minLabel, maxLabel} = this.props; 
    return(
        <>
       <Rating icon='star'defaultRating={3} size="large" maxRating={5} clearable onRate={(e, val)=> this.props.output(val.rating)} />
      </>
    )
    }
}

