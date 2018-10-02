import React from 'react'
import {inject, observer} from 'mobx-react'
import './style.css'

@inject("PoliciesStore")
@observer
export class CardFilter extends React.Component {
    filterClass = (val)=> {return val ? "CardFilterContainer" : "CardFilterContainer Disabled"};
    render() {
        const { PoliciesStore } = this.props    
        return(
            <div className="CardFiltersGroup">
                <div id="cardFilterPublished" className={this.filterClass(PoliciesStore.cardFilters.cardFilterPublished)} onClick={e => PoliciesStore.updateCardFilter(e)}>
                    <div className="CardFilter">Published</div>
                    <div className="CardFilterBadge">12</div>
                </div>
                <div id="cardFilterDrafts" className={this.filterClass(PoliciesStore.cardFilters.cardFilterDrafts)} onClick={e => PoliciesStore.updateCardFilter(e)}>
                    <div className="CardFilter">Drafts</div>
                    <div className="CardFilterBadge">11</div>
                </div>
                <div id="cardFilterArchived" className={this.filterClass(PoliciesStore.cardFilters.cardFilterArchived)} onClick={e => PoliciesStore.updateCardFilter(e)}>
                    <div className="CardFilter">Archived</div>
                    <div className="CardFilterBadge">3</div>
                </div>
            </div>
        )
    }
}