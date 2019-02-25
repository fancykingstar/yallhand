import React from 'react';
import {inject, observer} from "mobx-react"
import Card from './Card'
import CreateContent from "../SharedUI/ManageContent/CreateContent"
import { initSearchObj, stupidSearch } from "../SharedCalculations/StupidSearch";
import './style.css'

@inject("PoliciesStore", "UIStore")
@observer
export class CardList extends React.Component {
    componentDidMount() {
        const { PoliciesStore } = this.props;
        const { UIStore } = this.props;
        if (UIStore.search.searchPoliciesData.length === 0) {
            UIStore.set("search",
              "searchPoliciesData",
              initSearchObj(
                PoliciesStore.allPolicies,
                "policyID"
              ) 
            );
          }
    }

    render() {
        const { PoliciesStore } = this.props;
        const { UIStore } = this.props;

        const filteredByStatus = () => {
          let filtered = PoliciesStore.allPolicies.slice()
          filtered = UIStore.filter.cardFilterPublished? filtered : 
            filtered
            .filter(policy => !["ok", "partial", "notOk"].includes(policy.state))
          filtered = UIStore.filter.cardFilterDrafts? filtered : 
          filtered
            .filter(policy => policy.state !== "draft")
          filtered = UIStore.filter.cardFilterArchived? filtered : 
          filtered
          .filter(policy => policy.state !== "archived")
          return sort(filtered)
        } 

        const filteredByChannel = (i) => {
          return UIStore.sideNav.activeChannel === "All" ? i : i.filter(policy => policy.chanID === UIStore.sideNav.activeChannel)
        }

        const filteredBySearch = () => {
            if (UIStore.search.searchPolicies !== "") {
              const results = stupidSearch(
                UIStore.search.searchPoliciesData,
                UIStore.search.searchPolicies
              );
              
              return PoliciesStore.allPolicies.filter(item => results.includes(item.policyID));
            } else {
              return filteredByChannel(filteredByStatus())
            }
          };

        const sort = (policies) => {
          const sorted = policies.slice()
          return UIStore.dropdown.policySort === "Newest" ?
          sorted
            .sort((a, b) => b["updated"] - a["updated"])
          : 
          sorted
          .sort((a, b) => a["updated"] - b["updated"]);        
        }
      
        const cards = filteredBySearch().map(card => <Card data={card} key={card.label} img={card.img}/>)
        const createcard = PoliciesStore.allPolicies.length === 0 && UIStore.isScreenLoading === true ? <div></div> : <CreateContent mode="policy"/>
        
        return(
            <div className="CardList">
               
                {createcard}
                {cards}
             
            </div>
        )
    }
}