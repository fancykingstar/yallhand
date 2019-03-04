import React from "react";
import { inject, observer } from "mobx-react";
import { VariationConfig } from "./VariationConfig";
import { VariationContent } from "./VariationContent";
import { PublishControls } from "./PublishControls";
import holdUnload, { HoldLeave } from "../../SharedUI/ConfirmLeave";
import {content, contentEdit, history} from "../../DataExchange/PayloadBuilder"
import {createPolicy, createAnnouncement, modifyPolicy, modifyAnnouncement, createHistory} from "../../DataExchange/Up"
import _ from "lodash";
import { link } from "fs";
import {validateURLs} from "./ValidateURLs"

@inject("DataEntryStore", "UserStore", "PoliciesStore", "AnnouncementsStore", "UIStore", "ResourcesStore")
@observer
export class NewEditVariation extends React.Component {
  constructor(props){
    super(props)
    this.mode = this.props.location.pathname.includes("policy") ? "policy" : "announcement"
  }
  componentWillUnmount = () => {
    const { DataEntryStore, UIStore } = this.props;
    // holdUnload(DataEntryStore.isEntryUpdated);
      DataEntryStore.reset("content")
      DataEntryStore.resetDraft()
      UIStore.reset("content")
    }
  componentDidMount() {
    const { UIStore, PoliciesStore, AnnouncementsStore, DataEntryStore } = this.props;
    
    const load = (vari) => {
      UIStore.set("content", "variationID", this.props.match.params.id)
      this.mode === "policy" ? UIStore.set("content", "policyID", PoliciesStore._getPolicyIDfromVariation(this.props.match.params.id), this.props.match.params.id)
        :UIStore.set("content", "announcementID", AnnouncementsStore._getAnnouncementIDfromVariation(this.props.match.params.id), this.props.match.params.id)
      DataEntryStore.set("content", "label", vari.label)
      DataEntryStore.set("content", "teamID", vari.teamID)
      DataEntryStore.set("content", "tagID", vari.tags.length === 0? "none" : vari.tags[0])
      DataEntryStore.set("content", "stage", vari.stage)
      DataEntryStore.set("content", "contentRAW", vari.contentRAW)
      DataEntryStore.set("content", "contentHTML", vari.contentHTML)
      DataEntryStore.set("content", "isNew", false)
    }

    if(this.mode === "policy"){
      if(UIStore.content.variationID === "" || this.props.match.params.id !== UIStore.content.variationID){
        const vari = PoliciesStore._getVariation(PoliciesStore._getPolicyIDfromVariation(this.props.match.params.id), this.props.match.params.id)
        if(!_.isEmpty(vari) ){load(vari)}
        else{this.props.history.push("/panel/faqs")}
      }
    }
    else if(this.mode === "announcement") {
        if(UIStore.content.announcementID === "" || this.props.match.params.id !== UIStore.content.variationID){
          const vari = AnnouncementsStore._getVariation(AnnouncementsStore._getAnnouncementIDfromVariation(this.props.match.params.id), this.props.match.params.id)
          if(!_.isEmpty(vari)){load(vari)}
          else{this.props.history.push("/panel/announcements")}
      }}
  }

  render() {
    const { DataEntryStore, UIStore } = this.props;
    const changeStage = (stage) => {
      DataEntryStore.set("content", "stage", stage)
      //History
      if(stage === "published"){
        if(DataEntryStore.content.isNew){
          createHistory(history(this.mode, UIStore.content[this.mode + "ID"], content(this.mode)))
        }
        else{
          createHistory(history(this.mode, UIStore.content[this.mode + "ID"], contentEdit(this.mode)))
        }
      }
      //Update any links 
      validateURLs(this.mode)
      //Push actual content update
      if(DataEntryStore.content.isNew){
        this.mode === "policy"? createPolicy(content(this.mode)): createAnnouncement(content(this.mode))
      }
      else{
        this.mode === "policy"? modifyPolicy(contentEdit(this.mode)): modifyAnnouncement(contentEdit(this.mode))
      }
      DataEntryStore.content.isNew? DataEntryStore.set("content", "isNew", "false") : null
    }
    
    const newEditVariation =
      UIStore.content.variationID === "" ? (
        <div />
      ) : (
        <React.Fragment>
          <PublishControls
            stage={DataEntryStore.content.stage}
            onClick={val => {changeStage(val)}}
          />

          <VariationConfig
            mode={this.mode}
          />
          <VariationContent mode={this.mode}/>
        
          {/* <HoldLeave
            value={DataEntryStore.isEntryUpdated}
          /> */}
        </React.Fragment>
      );

    return <div className="PolicyFrame">{newEditVariation}</div>;
  }
}
