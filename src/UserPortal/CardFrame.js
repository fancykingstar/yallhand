import React from "react";
import { inject, observer } from "mobx-react";
import { UserCard } from "./UserCard";
import { SortNSearch } from "../SharedUI/SortNSearch"
import "./style.css";

@inject("PoliciesStore", "UIStore")
@observer
export class CardFrame extends React.Component {
  render() {
    const { PoliciesStore, UIStore } = this.props;
    const validData = PoliciesStore.allPolicies;
    const cardData =
      UIStore.sideNav.activePrimary === ""
        ? validData
        : validData.filter(
            policy => policy.chanID === UIStore.sideNav.activeChannel
          );
    const cards = cardData.map(card => (
      <UserCard data={card} key={card.label} img={card.img} />
    ));

    return (
      <div style={{marginTop: -35, paddingRight: 15}}>
      <div style={{height: 50}}>
               <SortNSearch 
          dropdownValueChange={val => UIStore.set("dropdown", "portalAnncSort", val)} 
          searchValueChange={val =>  UIStore.set("search", "searchPortalAnncValue", val)} 
          searchValue={UIStore.search.searchPortalAnncValue}
          />
      </div>
       
    <div className="CardList" style={{paddingTop: 25}}>
    {cards}
    </div>
      </div>

      
    )
  }
}
