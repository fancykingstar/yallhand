import React from 'react';
import {inject, observer} from "mobx-react"
import { Card } from './Card'
import CreateCard from './CreateCard'
import './style.css'

@inject("PoliciesStore")
@observer
export class CardList extends React.Component {
 

    render() {
        const { PoliciesStore } = this.props;
        const cardData = PoliciesStore.filteredPolicies
      
        const cards = cardData.map(card => <Card data={card} key={card.label} img={card.img}/>
            )
        return(
            <div className="CardList">
               
                <CreateCard />
                {cards}
            
            </div>
        )
    }
}