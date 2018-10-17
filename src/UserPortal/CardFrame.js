import React from 'react';
import {inject, observer} from "mobx-react"
import { UserCard } from './UserCard'
import './style.css'

@inject("PoliciesStore", "SideBarStore")
@observer
export class CardFrame extends React.Component {
    componentDidMount() {
        
        // const { PoliciesStore } = this.props;
        // PoliciesStore.loadPolicies()
    }

    render() {
        const { PoliciesStore } = this.props;
        const { SideBarStore } = this.props;
        
        const cardData = PoliciesStore.userAvailableFilteredPolicies
        const cards = cardData.map(card => <UserCard data={card} key={card.label} img={card.img}/>
            )
        return(
            <div className="CardList">
                {cards}
            
            </div>
        )
    }
}