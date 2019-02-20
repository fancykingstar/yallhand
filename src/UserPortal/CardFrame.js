import React from 'react';
import {inject, observer} from "mobx-react"
import { UserCard } from './UserCard'

import './style.css'

@inject("PoliciesStore", "ChannelStore", "UserStore", "UIStore")
@observer
export class CardFrame extends React.Component {
 

    render() {
        const { PoliciesStore, ChannelStore, UIStore } = this.props;
        const validData = PoliciesStore.userAvailablePolicies
        const cardData = UIStore.sideNav.activePrimary === "" ? validData : validData.filter(policy => policy.chanID === UIStore.sideNav.activeChannel)
        const cards = cardData.map(card => <UserCard data={card} key={card.label} img={card.img}/>)
 

        
        return(
            <div className="CardList">
     
                {cards}

             
        
            </div>
        )
    }
}