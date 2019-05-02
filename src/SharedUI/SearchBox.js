import React from "react"
import {Transition, Input, Icon} from "semantic-ui-react"

export class SearchBox extends React.Component {
    render(){
        return(
            <React.Fragment>
                <Input icon='search' placeholder='Search...' 
            onChange={(e, val) => this.props.output(val.value)} 
            value={this.props.value}
            />
                 <div style={{paddingLeft: 7, width: 25, height: 20, display: "inline-block"}} > 
            <Transition duration={200} animation="fade" visible={this.props.value !== ""}> 
                <Icon onClick={e => this.props.output("")}  color="grey" circular inverted name="remove" size="small"/> 
            </Transition> 
            </div>
             </React.Fragment>
    
         
        )
    }
}