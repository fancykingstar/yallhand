import React from "react";
import { inject, observer } from "mobx-react";
import UserCard from "./UserCard";
import { SortNSearch } from "../SharedUI/SortNSearch"
import { sortByUTC } from "../SharedCalculations/SortByUTC";
import { PortalContentNoResults } from "./PortalContentNoResults"
import "./style.css";

@inject("PoliciesStore", "UIStore")
@observer
export class CardFrame extends React.Component {
  render() {
    const { PoliciesStore, UIStore } = this.props;
    const validData = PoliciesStore.allPolicies;
    const cardData =
    UIStore.sideNav.activeChannel === "All"
        ? validData
        : validData.filter(
            policy => policy.chanID === UIStore.sideNav.activeChannel
          );
    const cards = sortByUTC(cardData, UIStore.dropdown.portalPolicySort).map(card => (
      <UserCard data={card} key={card.label} img={card.img} />
    ));

    const displayContent = cardData.length > 0?   <div className="CardList" style={{paddingTop: 25}}> {cards} </div>  : <PortalContentNoResults/>


    return (
      <div style={{marginTop: -35, paddingRight: 15, marginLeft: -10}}>
      <div style={{height: 50}}>
               <SortNSearch 
          dropdownValueChange={val => UIStore.set("dropdown", "portalPolicySort", val)} 
          />
      </div>
      {displayContent}
  
      </div>

      
    )
  }
}
