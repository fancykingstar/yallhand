import React from "react";

export class MultiChoice extends React.Component {
    constructor(props){
        super(props);
        this.state={active: ""};
    }
  handleClick(val) {
      this.setState({active: val});
      this.props.output(val);
  }

  render() {
        const display = this.props.answeroptions.map((choice, i)=> 
            <label className="customCheckbox" key={choice+i}>
            <input checked={this.state.active===choice} name="checkinput" value={choice} type="checkbox" onClick={()=>this.handleClick(choice)} />
            <span>{choice}</span>
          </label>
            )
  
      return (<>{display}</>);
  }
}
