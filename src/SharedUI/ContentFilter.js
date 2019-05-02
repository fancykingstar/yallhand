import React from "react";
import { inject, observer } from "mobx-react";
import "./ContentFilterStyle.css";


@inject("UIStore", "AnnouncementsStore", "PoliciesStore")
@observer
export class ContentFilter extends React.Component {
    constructor(props){
        super(props)
        const {AnnouncementsStore, PoliciesStore} = this.props
        this.mode = this.props.mode === 'policy' ? 'card' : 'annc'
        this.allAvail = this.props.mode === 'policy'? PoliciesStore.allPolicies.slice() : AnnouncementsStore.allAnnouncements.slice()
    }
  componentDidMount() {
    const { UIStore } = this.props;
    UIStore.set("filter", `${this.mode}FilterPublished`, true)
    UIStore.set("filter", `${this.mode}FilterDrafts`, true)
    UIStore.set("filter", `${this.mode}FilterArchived`, false)
  }

  render() {
    const { UIStore, AnnouncementsStore, PoliciesStore } = this.props;
    const filterClass = val => 
      val ? "CardFilterContainer" : "CardFilterContainer Disabled";
   
    const contentFilterToStage = {ok: `${this.mode}FilterPublished`, partial: `${this.mode}FilterPublished`, draft: `${this.mode}FilterDrafts`, notOk: `${this.mode}FilterPublished`, archived: `${this.mode}FilterArchived`};
    
    const counts = () => {
      let contentFilterCountsLocal = { published: 0, drafts: 0, archived: 0 };
      this.allAvail.forEach(i => {
        try {
          let val = contentFilterToStage[i.state].toLowerCase();
          let current = val.split(`${this.mode}filter`)[1];
          contentFilterCountsLocal[current]++; 
        } catch (e) {
          console.log(e)
        }
      });
      return contentFilterCountsLocal;
    };
    

    return (
      <div>
        <div
          className={filterClass(UIStore.filter[`${this.mode}FilterPublished`])}
          onClick={e =>
            UIStore.set(
              "filter",
              `${this.mode}FilterPublished`,
              !UIStore.filter[`${this.mode}FilterPublished`]
            )
          }
        >
          <div className="CardFilter">Published</div>
          <div className="CardFilterBadge">{counts().published}</div>
        </div>
        
        <div
          className={filterClass(UIStore.filter[`${this.mode}FilterDrafts`])}
          onClick={e =>
            UIStore.set(
              "filter",
              "anncFilterDrafts",
              !UIStore.filter[`${this.mode}FilterDrafts`]
            )
          }
        >
          <div className="CardFilter">Drafts</div>
          <div className="CardFilterBadge">{counts().drafts}</div>
        </div>
        <div
          className={filterClass(UIStore.filter[`${this.mode}FilterArchived`])}
          onClick={e =>
            UIStore.set(
              "filter",
              "anncFilterArchived",
              !UIStore.filter[`${this.mode}FilterArchived`]
            )
          }
        >
          <div className="CardFilter">Archived</div>
          <div className="CardFilterBadge">{counts().archived}</div>
        </div>
      </div>
    );
  }
}
