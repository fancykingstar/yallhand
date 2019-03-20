import React from "react";
import { CardList } from "./CardList";
import CardSort from "./CardSort";
import { CardFilter } from "./CardFilter";
import { observer, inject } from "mobx-react";
import "./style.css";

@inject("UserStore", "PoliciesStore", "UIStore")
@observer
export class CardFrame extends React.Component {
  render() {
    const { UIStore } = this.props;

    const responsive = UIStore.responsive.isMobile? 
        <React.Fragment>
            <div style={{float: "left", width: 180}}> <CardFilter /></div>
            <div style={{float: "right"}}>   <CardSort /></div>
        </React.Fragment>
        :
        <React.Fragment>
            <CardFilter/>
            <CardSort/>
        </React.Fragment>
    
    return (
      <div className="CardFrame">
        {responsive}
          <CardList />
    </div>
    );
  }
}
