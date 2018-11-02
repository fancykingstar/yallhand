import React from 'react';
import {inject, observer} from "mobx-react"
import { UserCard } from './UserCard'
import {validDisplayPolicies} from '../SharedCalculations/ValidTeams'
import './style.css'

@inject("PoliciesStore", "SideBarStore", "UserStore")
@observer
export class CardFrame extends React.Component {
    componentWillMount() {
        const { PoliciesStore } = this.props;
        const { UserStore } = this.props;
        PoliciesStore.loadPolicies()
        const validData = validDisplayPolicies(PoliciesStore.allPolicies, UserStore.previewTeamPath, UserStore.previewTagPath)
        PoliciesStore.loadUserPortalPolicies(validData)
    }

    render() {
        const { PoliciesStore } = this.props;
        const { SideBarStore } = this.props;
        const { UserStore } = this.props;
        const validData = PoliciesStore.userAvailablePolicies
        const cardData = validData.filter(policy => policy.chanID === SideBarStore.channelKeys[SideBarStore.active])
        // cardData.forEach(policy => {
        //     policy.variations = policy.variations.filter(variation => variation.teamID === UserStore.previewTeam)
        // })
                        
  

        const cards = cardData.map(card => <UserCard data={card} key={card.label} img={card.img}/>)
 

        
        return(
            <div className="CardList">
     
                {cards}

             
        
            </div>
        )
    }
}