import React from "react";
import { inject, observer } from "mobx-react";
import { Form } from "semantic-ui-react";
import { ToastContainer,
  // toast
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

@inject("TeamStore", "DataEntryStore")
@observer
export class TeamTagSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }
  render() {
    const { TeamStore } = this.props;
    const { DataEntryStore } = this.props;
    // const { PoliciesStore } = this.props;
    const multi = this.props.multi === true ? { multiple: true } : null;
    // const isfluid = this.props.fluid === true ? { fluid: true } : { fluid: false };
    let teamList = TeamStore.structureSelect;
    let tagList = TeamStore.tagsSelect;
    const defaultTeam = this.props.defaultTeam;
    const defaultTag = this.props.defaultTag;
    // const invalidCombos = DataEntryStore.isNewObj ? [] :
    //   DataEntryStore.isNewVariation ?
    //   PoliciesStore._currentObj.variations.map(vari => ({
    //       team: vari.teamID,
    //       tags: vari.tags
    //     }))
    //   : PoliciesStore._currentObj.variations
    //       .filter(
    //         vari => vari.teamID !== defaultTeam && vari.tags !== defaultTag
    //       )
    //       .map(vari => ({ team: vari.teamID, tags: vari.tags }));
    const checkValid = (type, val) => {
      type === "team"
        ? DataEntryStore.setTeam(val)
        : DataEntryStore.setTag([val]);
      // const currentCombo = {
      //   team: DataEntryStore.selectedTeam,
      //   tags: DataEntryStore.selectedTag
      // };
      // invalidCombos.forEach(combo => {
      //   if (
      //     combo["team"] === currentCombo["team"] &&
      //     combo["tags"][0] === currentCombo["tags"][0]
      //   ) {
      //     DataEntryStore.togglePreventSave(true)
      //     const errorMsg = require("../MessagesNotifications/ContentMessages.json");
      //     toast.error(errorMsg.errors.invalidAudience, {
      //       hideProgressBar: true
      //     });
      //     this.setState({ error: true });
      //   } else {
      //     if (this.state.error === true) {
      //       this.setState({ error: false });
      //       DataEntryStore.togglePreventSave(false)
      //     }

      //   }
      // }
      // );
    };

    return (
      <React.Fragment>
        <ToastContainer />
        {teamList.length > 1 ?
          <Form.Dropdown
            label="Teams"
            placeholder="Choose a team"
            {...multi}
            // {...isfluid}
            // focus
            error={this.state.error}
            search
            selection
            options={teamList}
            defaultValue={defaultTeam}
            onChange={(e, val) => checkValid("team", val.value)}
            style={{ minWidth: 200 }}
          />
          :
          null
        }
        {tagList.length > 0 ?
          <Form.Dropdown
            label="Tags (optional)"
            placeholder="Tags"
            // isfluid
            error={this.state.error}
            {...multi}
            // {...isfluid}
            search
            selection
            options={tagList}
            defaultValue={defaultTag.length === 0 ? "none" : defaultTag}
            onChange={(e, val) => checkValid("tag", val.value)}
            style={{ minWidth: 200 }}
          />
          :
          null
        }
      </React.Fragment>
    );
  }
}
