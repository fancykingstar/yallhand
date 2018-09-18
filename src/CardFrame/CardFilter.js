import React from 'react'

import './style.css'

export class CardFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardFilterActive: true,
            cardFilterNotActive: false,
            cardFilterArchived: false
        }
    }
    handleClick = (e) => {
        e.preventDefault()
        const newState = {};
        newState[e.currentTarget.id] = !(this.state[e.currentTarget.id]);
        this.setState (newState);
    }
    filterClass = (val)=> {return val ? "CardFilterContainer" : "CardFilterContainer Disabled"};
    render() {
        return(
            <div className="CardFiltersGroup">
                <div id="cardFilterActive" className={this.filterClass(this.state.cardFilterActive)} onClick={e => this.handleClick(e)}>
                    <div className="CardFilter">Active</div>
                    <div className="CardFilterBadge">12</div>
                </div>
                <div id="cardFilterNotActive" className={this.filterClass(this.state.cardFilterNotActive)} onClick={e => this.handleClick(e)}>
                    <div className="CardFilter">Not Active</div>
                    <div className="CardFilterBadge">11</div>
                </div>
                <div id="cardFilterArchived" className={this.filterClass(this.state.cardFilterArchived)} onClick={e => this.handleClick(e)}>
                    <div className="CardFilter">Archived</div>
                    <div className="CardFilterBadge">3</div>
                </div>
            </div>
        )
    }
}