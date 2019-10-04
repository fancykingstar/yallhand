import React from "react";
import { inject, observer } from "mobx-react";

import VariationContent from "./VariationContent";

import toast from "../../YallToast";
import isEmpty from 'lodash.isempty';

@inject("DataEntryStore", "UserStore", "PoliciesStore", "AnnouncementsStore", "UIStore", "ResourcesStore")
@observer
class NewEditVariation extends React.Component {
  constructor(props){
    super(props)
    const {match} = this.props;
    this.state = {
      loaded: false,
      mode: match.path.includes("announcements")? "announcement":"policy",
      isNew: _.isEmpty(match.params),
      id: this.isNew? "": match.params.id,
      content: {}
    }
  }

  async loadContent() {
    const {id, mode, isNew} = this.state;
    if(!id) {
      this.setState({loaded:true});
      return
    }
    const { UIStore, PoliciesStore, AnnouncementsStore, DataEntryStore } = this.props;
    const isLoaded = mode === "announcement"? AnnouncementsStore._SearchVariation(id): PoliciesStore._SearchVariation(id);
    await this.setState({content: isLoaded, loaded:true})
    if(id && isEmpty(this.state.content)) this.props.history.push("/panel/announcements");
  }

  changeStage(stage) {
    const { AnnouncementsStore, PoliciesStore, DataEntryStore, UIStore, history } = this.props;
    const { isNew } = DataEntryStore.content;
    const { mode } = this;
    DataEntryStore.set("content", "stage", stage)
    if (stage === "published") {
      const historyMode = contentHistory(mode, UIStore.content[`${mode}ID`], isNew ? content(mode) : contentEdit(mode))
      createHistory(historyMode)
    }
    const isPolicy = mode === "policy";
    const path = isPolicy ? '/panel/faqs/manage-policy/' : '/panel/announcements/manage-announcement/';
    const typeId = `${mode}ID`;
    if (isNew) {
      (isPolicy ? createPolicy(content(mode)) : createAnnouncement(content(mode))).then(res => {
        if (isPolicy) PoliciesStore.pushPolicies(res);
        else AnnouncementsStore.pushAnnouncements(res);
        const id = res[typeId];
        UIStore.set("content", typeId, id);
        history.push(`${path}${res[id]}`);
      });
    }
    else {
      if (isPolicy) modifyPolicy(contentEdit(mode));
      else modifyAnnouncement(contentEdit(mode));
      if (isNew) DataEntryStore.set("content", "isNew", false);
      history.push(`${path}${UIStore.content[mode + "ID"]}`);
    }
  }

  componentDidMount() {
    const {isNew, loaded, id, content} = this.state;
    this.loadContent();

  };

  render() {
    const {loaded, content, mode} = this.state;

    return (
      <div>
          {loaded &&
             <>
             <VariationContent mode={mode} data={this.state}/>
             </>
          }
      </div>
    );
  }
}

export default NewEditVariation;