import React from 'react';
import light from "./yh-logo.png";
import std from "./yh-logo-gray.png";
import dark from "./yh-logo-dark.png";
import blue from "./yh-logo-blue.png";


export class QLogo extends React.Component {

    getStyle(){
        if(this.props.dark) return dark;
        else if(this.props.light) return light;
        else if(this.props.blue) return blue;
        else return std;
    }

    render() {
        const width = this.props.width === undefined? "130px" :this.props.width;
        return(
            <img src={this.getStyle()} width={width} />
        )
    };
};