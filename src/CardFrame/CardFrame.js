import React from "react";
import { CardList } from "./CardList";
import CardSort from "./CardSort";
import { CardFilter } from "./CardFilter";
import { observer, inject } from "mobx-react";
import { Header } from "semantic-ui-react";
import { Sort } from "../SharedUI/Sort";
import { SearchBox } from "../SharedUI/SearchBox"
import { ContentFilter } from "../SharedUI/ContentFilter";
import "./style.css";

@inject("UserStore", "PoliciesStore", "UIStore")
@observer
export class CardFrame extends React.Component {
  componentDidMount(){
    window.scrollTo(0, 0);
  }
  render() {
    const { UIStore } = this.props;

    const responsive = UIStore.responsive.isMobile? 
        <React.Fragment>
            <div style={{float: "left", width: 180}}> <CardFilter /></div>
            <div style={{float: "right"}}>   <CardSort /></div>
        </React.Fragment>
        :
        <React.Fragment>
          <div style={{marginLeft: 15}}>    <CardFilter/></div>
        
            <CardSort/>
        </React.Fragment>
    
    return (
      <div>
        <Header as="h2"
        style={{padding: 0, margin: 0}}
        >
          FAQs
          <Header.Subheader>
            Add frequently asked questions and answers
          </Header.Subheader>
        </Header>
        <div style={{width: "100%", paddingTop: 10, paddingBottom: 10, display: "flex", flexWrap: "wrap"}}>
            <div style={{flex: 1, verticalAlign: "top", minWidth: 300, minHeight: 30, width: 120}}>  <Sort dropdownValueChange={val => UIStore.set("dropdown", "policySort", val)}/></div>
            <div style={{flex: 2, verticalAlign: "top", minWidth: 300, paddingTop: 0, paddingBottom: 5, minHeight: 30,}}> <ContentFilter mode="policy" /> </div>
            <div style={{flex: 1, verticalAlign: "top", minWidth: 300, minHeight: 30, contentAlign: "right",}}> <SearchBox value={UIStore.search.searchPolicies} output={val => UIStore.set("search", "searchPolicies", val)} /></div>
        </div>
        <div className="CardFrame"> <CardList /></div>
    </div>
    );
  }
}
