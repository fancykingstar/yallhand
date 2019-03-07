import React from "react";
import { inject, observer } from "mobx-react";
import "./style.css";


@inject("UIStore", "AnnouncementsStore")
@observer
export class AnnouncementFilter extends React.Component {
  componentDidMount() {
    const { UIStore } = this.props;
    UIStore.set("filter", "anncFilterPublished", true)
    UIStore.set("filter", "anncFilterDrafts", true)
    UIStore.set("filter", "anncFilterArchived", false)
  }

  render() {
    const { UIStore, AnnouncementsStore } = this.props;
    const filterClass = val => 
      val ? "CardFilterContainer" : "CardFilterContainer Disabled";
   
    const anncFilterToStage = {ok: "anncFilterPublished", partial: "anncFilterPublished", draft: "anncFilterDrafts", notOk: "anncFilterPublished", archived: "anncFilterArchived"};
    
    const counts = () => {
      let anncFilterCountsLocal = { published: 0, drafts: 0, archived: 0 };
      AnnouncementsStore.allAnnouncements.forEach(annc => {
        let val = anncFilterToStage[annc.state].toLowerCase();
        let current = val.split("anncfilter")[1];
        anncFilterCountsLocal[current]++;
      });
      return anncFilterCountsLocal;
    };
    

    return (
      <div style={{marginLeft: -30}}>
        <div
          id="anncFilterPublished"
          className={filterClass(UIStore.filter.anncFilterPublished)}
          onClick={e =>
            UIStore.set(
              "filter",
              "anncFilterPublished",
              !UIStore.filter.anncFilterPublished
            )
          }
        >
          <div className="CardFilter">Published</div>
          <div className="CardFilterBadge">{counts().published}</div>
        </div>
        
        <div
          id="anncFilterDrafts"
          className={filterClass(UIStore.filter.anncFilterDrafts)}
          onClick={e =>
            UIStore.set(
              "filter",
              "anncFilterDrafts",
              !UIStore.filter.anncFilterDrafts
            )
          }
        >
          <div className="CardFilter">Drafts</div>
          <div className="CardFilterBadge">{counts().drafts}</div>
        </div>
        <div
          id="anncFilterArchived"
          className={filterClass(UIStore.filter.anncFilterArchived)}
          onClick={e =>
            UIStore.set(
              "filter",
              "anncFilterArchived",
              !UIStore.filter.anncFilterArchived
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
