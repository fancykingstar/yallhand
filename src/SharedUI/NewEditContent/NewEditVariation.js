import React from "react";
import { inject, observer } from "mobx-react";
import { createPolicy, createAnnouncement, modifyPolicy, modifyAnnouncement, createHistory } from "../../DataExchange/Up"
import { content, contentEdit } from "../../DataExchange/PayloadBuilder"
// import { withRouter } from "react-router-dom";
import { VariationContent } from "./VariationContent";
import { VariationConfig } from "./VariationConfig";
import { PublishControls } from "./PublishControls";
import { validateURLs } from "./ValidateURLs"
import _ from "lodash";

@inject("DataEntryStore", "UserStore", "PoliciesStore", "AnnouncementsStore", "UIStore", "ResourcesStore")
@observer
class NewEditVariation extends React.Component {
  
  constructor(props){
    super(props)
    this.mode = this.props.location.pathname.includes("policy") ? "policy" : "announcement"
    this.state = {
      announcementID: '',
      variationID: ''
    }
  }

  componentWillUnmount = () => {
    const { DataEntryStore, UIStore } = this.props;
    DataEntryStore.reset("content")
    DataEntryStore.resetDraft()
    UIStore.reset("content")
  }

  componentDidMount() {
    const { UIStore, PoliciesStore, AnnouncementsStore } = this.props;
    UIStore.set("modal", "uploadAssocEdit", false)
    const id = this.props.match.params.id;
    const { content } = UIStore;
    const { announcementID, variationID } = content;

    if (this.mode === "policy") {
      if (variationID === "" || id !== variationID){
        const vari = PoliciesStore._getVariation(PoliciesStore._getPolicyIDfromVariation(id), id)
        if (!_.isEmpty(vari) ) this.load(vari)
        else this.props.history.push("/panel/faqs")
      }
    }
    else if (this.mode === "announcement") {
      if (announcementID === "" || id !== variationID) {
        const vari = AnnouncementsStore._getVariation(AnnouncementsStore._getAnnouncementIDfromVariation(id), id)
        if (!_.isEmpty(vari)) this.load(vari)
        else this.props.history.push("/panel/announcements")
      }
    }
  }

  load(variation) {
    const { label, teamID, tags, stage, contentRAW, contentHTML } = variation;
    const { UIStore, AnnouncementsStore, PoliciesStore, DataEntryStore } = this.props;
    const { id } = this.props.match.params;

    UIStore.set("content", "variationID", id)
    this.mode === "policy" ? UIStore.set("content", "policyID", PoliciesStore._getPolicyIDfromVariation(id), id) : /*null*/
      UIStore.set("content", "announcementID", AnnouncementsStore._getAnnouncementIDfromVariation(id), id)
    DataEntryStore.set("content", "label", label)
    DataEntryStore.set("content", "teamID", teamID)
    DataEntryStore.set("content", "tagID", tags.length === 0? "none" : tags[0])
    DataEntryStore.set("content", "stage", stage)
    DataEntryStore.set("content", "contentRAW", contentRAW)
    DataEntryStore.set("content", "contentHTML", contentHTML)
    DataEntryStore.set("content", "isNew", false)
  }

  changeStage(stage) {
    const { AnnouncementsStore, DataEntryStore, UIStore, history } = this.props;
    const { isNew } = DataEntryStore.content;
    const { mode } = this;
    DataEntryStore.set("content", "stage", stage)

    if (stage === "published") {
      // console.log(isNew ? content(mode) : contentEdit(mode))
      // const historyMode = history(mode, UIStore.content[`${mode}ID`], isNew ? content(mode) : contentEdit(mode))
      // createHistory(historyMode)
    }
    
    validateURLs(mode);
    if (isNew) {
      (mode === "policy" ? createPolicy(content(mode)) : createAnnouncement(content(mode))).then(res => {
        AnnouncementsStore.pushAnnouncements(res);
        UIStore.set("content", "announcementID", res.announcementID)
        history.push(`/panel/announcements/manage-announcement/${res.announcementID}`);
      });
    }
    else {
      mode === "policy" ? modifyPolicy(contentEdit(mode)) : modifyAnnouncement(contentEdit(mode));
    }
    if (isNew) DataEntryStore.set("content", "isNew", false)
  }
  
  render() {
    const { DataEntryStore } = this.props;
    const { content } = DataEntryStore;
    const { announcementID, variationID, stage } = content;
    const { mode } = this;

    return (
      <div className="PolicyFrame">
        {(variationID !== "" || announcementID !== "") && <React.Fragment>
          <PublishControls stage={stage} onClick={val => this.changeStage(val)}/>
          <VariationConfig mode={mode}/>
          <VariationContent mode={mode}/>
        </React.Fragment>}
      </div>
    );
  }
}

export default NewEditVariation;
// export default withRouter(NewEditVariation);