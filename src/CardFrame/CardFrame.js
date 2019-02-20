import React from 'react';
import { CardList } from './CardList'
import CardSort from './CardSort'
import { CardFilter } from './CardFilter'
import './style.css'
import { observer, inject } from 'mobx-react';


@inject("UserStore", "PoliciesStore", "UIStore")
@observer
export class CardFrame extends React.Component {

    render() {
        
        
        return(
            <div className="CardFrame">
                <CardFilter />
                <CardSort />
                <CardList />
            </div>
        )
    }
}