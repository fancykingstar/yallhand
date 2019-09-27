import React from "react";
import Slider from '@material-ui/core/Slider';

export class SliderScale extends React.Component {
    render(){
        const {max, minLabel, maxLabel} = this.props; 
    return(
        <>
        <Slider
        defaultValue={5}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        min={1}
        max={max}
        onChangeCommitted={(e,val)=>this.props.output(val)}
      />
        <div style={{width: "100%"}}>
            <div style={{float: "left", maxWidth: "150px"}}>{minLabel}</div>
            <div style={{float: "right", maxWidth: "150px"}}>{maxLabel}</div>
        </div>
      </>
    )
    }
}

