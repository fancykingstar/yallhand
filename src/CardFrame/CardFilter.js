import React from 'react'
import {inject, observer} from 'mobx-react'
import './style.css'

@inject("PoliciesStore")
@observer
export class CardFilter extends React.Component {
    componentDidMount() {
        const {PoliciesStore} = this.props
        PoliciesStore.cardFilterCount()
    }
    
    render() {
        const {PoliciesStore} = this.props
        const filterClass = (val)=> {return val ? "CardFilterContainer" : "CardFilterContainer Disabled"}; 
        return(
            <div className="CardFiltersGroup">
                <div id="cardFilterPublished" className={filterClass(PoliciesStore.cardFilters.cardFilterPublished)} onClick={e => PoliciesStore.updateCardFilter(e)}>
                    <div className="CardFilter">Published</div>
                    <div className="CardFilterBadge">{PoliciesStore.cardFilterCounts['published']}</div>
                </div>
                <div id="cardFilterDrafts" className={filterClass(PoliciesStore.cardFilters.cardFilterDrafts)} onClick={e => PoliciesStore.updateCardFilter(e)}>
                    <div className="CardFilter">Drafts</div>
                    <div className="CardFilterBadge">{PoliciesStore.cardFilterCounts['drafts']}</div>
                </div>
                <div id="cardFilterArchived" className={filterClass(PoliciesStore.cardFilters.cardFilterArchived)} onClick={e => PoliciesStore.updateCardFilter(e)}>
                    <div className="CardFilter">Archived</div>
                    <div className="CardFilterBadge">{PoliciesStore.cardFilterCounts['archived']}</div>
                </div>
            </div>
        )
    }
}