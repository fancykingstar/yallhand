import React from "react";
import { inject, observer } from "mobx-react";
import { Files } from "./Files"
import "./style.css";

@inject("UIStore")
@observer
class ResourcesFrame extends React.Component {
  componentWillUnmount(){
    const {UIStore} = this.props;
  }
  componentDidMount(){
    window.scrollTo(0, 0);
  }
  render() {
    const handleItemClick = (e, { name }) => {
      UIStore.set("menuItem","resourcesFrame", name);
    };
    const isVisable = name => {
      return name === UIStore.menuItem.resourcesFrame ? "Visable" : "Hidden";
    };
    const { UIStore } = this.props;
    const menuItems = ["file", "URL"];
    return (
      <div>
        <div style={{float: "right", marginRight: 10, marginTop: 10}}>  
        </div> 
        <div className="ResourceActionFrame">
          <div>
            <Files/>
          </div>
        </div>
      </div>
    );
  }
}

export default ResourcesFrame
