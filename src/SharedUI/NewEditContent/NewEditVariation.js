import React from "react";
import { inject, observer } from "mobx-react";
import { createPolicy, createAnnouncement, modifyPolicy, modifyAnnouncement, createHistory } from "../../DataExchange/Up"
import { content, contentEdit, contentHistory } from "../../DataExchange/PayloadBuilder"
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
  }

  componentDidMount() {
    const { UIStore, PoliciesStore, AnnouncementsStore, DataEntryStore } = this.props;
    UIStore.set("modal", "uploadAssocEdit", false)
    const id = this.props.match.params.id;
    const { content } = UIStore;
    const { announcementID, variationID } = content;

    const load = async (variation) => {
      const { label, teamID, tags, stage, contentRAW, contentHTML, variationID } = variation;
      // const { UIStore, AnnouncementsStore, PoliciesStore, DataEntryStore } = this.props;
      const { id } = this.props.match.params;
  
      UIStore.set("content", "variationID", id)
      await this.mode === "policy" ? UIStore.set("content", "policyID", PoliciesStore._getPolicyIDfromVariation(id), id) : /*null*/
        UIStore.set("content", "announcementID", AnnouncementsStore._getAnnouncementIDfromVariation(id), id)
      DataEntryStore.set("content", "label", label)
      DataEntryStore.set("content", "teamID", teamID)
      DataEntryStore.set("content", "tagID", tags.length === 0? "none" : tags[0])
      DataEntryStore.set("content", "stage", stage)
      DataEntryStore.set("content", "contentRAW", contentRAW)
      DataEntryStore.set("content", "contentHTML", contentHTML)
      DataEntryStore.set("content", "isNew", false)
      DataEntryStore.set("content", "variationID", variationID)

    }

    if (this.mode === "policy") {
      if (variationID === "" || id !== variationID){
        const vari = PoliciesStore._getVariation(PoliciesStore._getPolicyIDfromVariation(id), id)
        if (!_.isEmpty(vari) ) load(vari)
        else this.props.history.push("/panel/faqs")
      }
    }
    else if (this.mode === "announcement") {
      if (announcementID === "" || id !== variationID) {
        const vari = AnnouncementsStore._getVariation(AnnouncementsStore._getAnnouncementIDfromVariation(id), id)
        if (!_.isEmpty(vari)) load(vari)
        else this.props.history.push("/panel/announcements")
      }
    }
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
    
    // validateURLs(mode);
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
    else 
    isPolicy ? modifyPolicy(contentEdit(mode)) : modifyAnnouncement(contentEdit(mode)).then(res => {
      if (isNew) DataEntryStore.set("content", "isNew", false)
      history.push(`${path}${UIStore.content[mode + "ID"]}`);
    });
 
  }
  
  render() {
    const { DataEntryStore } = this.props;
    const { content } = DataEntryStore;
    const { announcementID, variationID, stage } = content;
    const { mode } = this;
    return (
      <div style={{overflowY: "auto", overflowX: "hidden"}}>
        {(variationID !== "" || announcementID !== "" || DataEntryStore.content.isNew) && <React.Fragment>
          <PublishControls stage={stage} onClick={val => this.changeStage(val)}/>
          <VariationConfig mode={mode}/>
         {DataEntryStore.content.contentRAW === undefined? <div/> : <VariationContent mode={mode}/>}
        </React.Fragment>}
      </div>
    );
  }
}

export default NewEditVariation;