import React from "react";
import { inject, observer } from "mobx-react";
import "./style.css";

@inject("UIStore", "PoliciesStore")
@observer
export class CardFilter extends React.Component {
  componentDidMount() {
    const { UIStore } = this.props;
    UIStore.set("filter", "cardFilterPublished", true)
    UIStore.set("filter", "cardFilterDrafts", true)
    UIStore.set("filter", "cardFilterArchived", false)
  }

  render() {
    const { UIStore, PoliciesStore } = this.props;
    const filterClass = val => 
      val ? "CardFilterContainer" : "CardFilterContainer Disabled";
   
    const cardFilterToStage = {ok: "cardFilterPublished", partial: "cardFilterPublished", draft: "cardFilterDrafts", notOk: "cardFilterPublished", archived: "cardFilterArchived"};
    
    const counts = () => {
      let cardFilterCountsLocal = { published: 0, drafts: 0, archived: 0 };
      PoliciesStore.allPolicies.forEach(policy => {
        try {
          let val = cardFilterToStage[policy.state].toLowerCase();
          let current = val.split("cardfilter")[1];
          cardFilterCountsLocal[current]++;
        } catch (e) {
          console.log(e)
        }
      });
      return cardFilterCountsLocal;
    };

    return (
      <div className="CardFiltersGroup">
        <div
          id="cardFilterPublished"
          className={filterClass(UIStore.filter.cardFilterPublished)}
          onClick={e =>
            UIStore.set(
              "filter",
              "cardFilterPublished",
              !UIStore.filter.cardFilterPublished
            )
          }
        >
          <div className="CardFilter">Published</div>
          <div className="CardFilterBadge">{counts().published}</div>
        </div>
        
        <div
          id="cardFilterDrafts"
          className={filterClass(UIStore.filter.cardFilterDrafts)}
          onClick={e =>
            UIStore.set(
              "filter",
              "cardFilterDrafts",
              !UIStore.filter.cardFilterDrafts
            )
          }
        >
          <div className="CardFilter">Drafts</div>
          <div className="CardFilterBadge">{counts().drafts}</div>
        </div>
        <div
          id="cardFilterArchived"
          className={filterClass(UIStore.filter.cardFilterArchived)}
          onClick={e =>
            UIStore.set(
              "filter",
              "cardFilterArchived",
              !UIStore.filter.cardFilterArchived
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
