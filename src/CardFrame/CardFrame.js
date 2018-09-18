import React from 'react';
import { CardList } from './CardList'
// import { CardControls } from './CardControls'
import CardSort from './CardSort'
import { CardFilter } from './CardFilter'
import './style.css'

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