import React from "react";
import {Icon}from "semantic-ui-react";


export class SortingChevron extends React.Component {
    constructor(props){
    super(props);
    this.state={up: true};
}
toggle() {
    this.setState({up: !this.state.up});
    this.props.onClick(this.state.up? "highest":"lowest")
}

render(){
    return(
        <Icon className="sorting-chevron" style={{color:"#ABACAB"}} name={`chevron ${this.state.up? "up":"down"}`} size="small" onClick={()=>this.toggle()}/>
    )
}

}