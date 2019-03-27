import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import { SelectVariation } from "../../SharedUI/SelectVariation";
import { ManageVariationData } from "../../SharedUI/ManageVariationData";
import { getDisplayTags } from "../../SharedCalculations/GetDisplayTags";
import BackButton from "../../SharedUI/BackButton";
import { FeaturedImage } from "./FeaturedImage";
import { AddToEmail } from "./AddToEmail";
import { Keywords } from "./Keywords";
import { ReviewAlerts } from "./ReviewAlerts";
import { Schedule } from "./Schedule";
import { History } from "./History";
import { generateID } from "../../SharedCalculations/GenerateID";
import Settings from "./Settings";

import "./style.css";
import _ from "lodash";


@inject( "TeamStore", "DataEntryStore", "PoliciesStore", "UIStore", "AnnouncementsStore", "EmailStore")
@observer
class ManageContent extends React.Component {
  constructor(props) {
    super(props);
    const {UIStore} = this.props
    console.log(this.props.location.pathname)
    this.mode = this.props.location.pathname.includes("policy")
      ? "policy"
      : "announcement";
        // UIStore.reset("content")
  }
  componentWillUnmount() {
    const {DataEntryStore} = this.props
    DataEntryStore.reset("contentmgmt")
   
  }

  componentDidMount() {
    const { UIStore, AnnouncementsStore, DataEntryStore, PoliciesStore, EmailStore } = this.props;
    const { content } = UIStore;
    const { announcementID, policyID } = content;
    const { id } = this.props.match.params;

    const setDataEntryStore = (toggleVariation, obj, bundle) => {
      UIStore.set( "content", "variationID", toggleVariation);
      DataEntryStore.set("contentmgmt", "label", obj.label);
      DataEntryStore.set("contentmgmt", "img", obj.img);
      DataEntryStore.set("contentmgmt", "bundle", bundle);
      DataEntryStore.set("contentmgmt", "keywords", obj.keywords);
      DataEntryStore.set("contentmgmt", "reviewAlert", obj.reviewAlert);
      DataEntryStore.set("contentmgmt", "settingsLabel", obj.label);
      DataEntryStore.set("contentmgmt", "settingsChannel", obj.chanID);
    };

    if (this.mode === "policy") {
      if (policyID === "" || id !== policyID || DataEntryStore._isReset("contentmgmt")) {
        if (!_.isEmpty(PoliciesStore._getPolicy(id))) {
          UIStore.set("content", "policyID", id);
          const obj = Object.assign({}, PoliciesStore._getPolicy(policyID));
          setDataEntryStore(PoliciesStore._toggleGlobalVariation(obj.policyID), obj, EmailStore.queue.bundleID);
        }
        else this.props.history.push("/panel/faqs");
      }
      UIStore.set("content", "variationID", PoliciesStore._toggleGlobalVariation(policyID));
    } else if (this.mode === "announcement") {
      if (announcementID === "" || id !== announcementID || DataEntryStore._isReset("contentmgmt")) {
        if (!_.isEmpty(AnnouncementsStore._getAnnouncement(id))) {
          UIStore.set("content", "announcementID", id);
          const obj = Object.assign({}, AnnouncementsStore._getAnnouncement(announcementID));
          setDataEntryStore(AnnouncementsStore._toggleGlobalVariation(obj.announcementID), obj, "queue");
        }
        else this.props.history.push("/panel/announcements");
        UIStore.set("content", "variationID", AnnouncementsStore._toggleGlobalVariation(announcementID));
      }
    }
  }

  render() {    
    
    const { TeamStore, DataEntryStore, PoliciesStore, AnnouncementsStore, UIStore } = this.props;

    const obj = this.mode === "policy" ? 
    PoliciesStore._getPolicy(UIStore.content.policyID) 
    : AnnouncementsStore._getAnnouncement(UIStore.content.announcementID)

    const variations = () => {     
        return obj.variations.map(variation => ({
          key: variation.variationID,
          value: variation.variationID,
          description: getDisplayTags(variation.tags, TeamStore.tags),
          text: TeamStore.teamKey[variation.teamID],
          type: variation.type
        }));
      } 
      
    

    const handleEdit = e => {
      e.preventDefault();
      const vari = this.mode === "policy"?
      Object.assign(
        {},
        PoliciesStore._getVariation(
          UIStore.content.policyID,
          UIStore.content.variationID
        )
      )
      :
      Object.assign(
        {},
        AnnouncementsStore._getVariation(
          UIStore.content.announcementID,
          UIStore.content.variationID
        )
      )
        DataEntryStore.set("content", "label", vari.label);
        DataEntryStore.set("content", "teamID", vari.teamID);
        DataEntryStore.set("content", "tagID",vari.tags.length === 0 ? "none" : vari.tags[0]
        );
        DataEntryStore.set("content", "contentRAW", vari.contentRAW)
        DataEntryStore.set("content", "contentHTML", vari.contentHTML)
        DataEntryStore.set("content", "stage", vari.stage);
        DataEntryStore.set("content", "isNew", false);
        DataEntryStore.setDraft(vari.content)

        this.mode === "policy" ?
        this.props.history.push(
            "/panel/faqs/policy-variation/" + vari.variationID
          )
        : 
        this.props.history.push(
            "/panel/announcements/announcement-variation/" + vari.variationID
            
          );
       
      } 
      

      const handleCreateNew = e => {
        e.preventDefault();
          UIStore.set("content", "variationID", generateID());
          DataEntryStore.set("content", "contentRAW", null)
          DataEntryStore.set("content", "isNew", false);
          DataEntryStore.set("content", "stage", "draft");
          
          this.mode === "policy" ?
          this.props.history.push(
            "/panel/faqs/policy-variation/" + UIStore.content.variationID
          )
          :
          this.props.history.push(
            "/panel/announcements/announcement-variation/" + UIStore.content.variationID
          )
        
      };
      const handleChange = val => {
        UIStore.set("content", "variationID", val)
      };


      const vari = () => {
          return this.mode === "policy"? PoliciesStore._getVariation(UIStore.content.policyID, UIStore.content.variationID)
          :
          AnnouncementsStore._getVariation(UIStore.content.announcementID, UIStore.content.variationID)
      }
      
      const manageContent = () => {
        if(this.mode === "policy" && UIStore.content.policyID === "")
          {
            return <div/>
          }

        else if(this.mode === "announcement" && UIStore.content.announcementID === "")
        {return <div/>}    

        else{
            return(
                <React.Fragment>
                <BackButton />
                <Header
                  as="h2"
                  content={`Manage ${this.mode === "policy"? "FAQ" : this.mode
                    .charAt(0).toUpperCase() + this.mode.slice(1)}`}
                  subheader={DataEntryStore.contentmgmt.label}
                />
                <Segment>
                  <div style={{ maxWidth: 600 }}>
                    <Header>Available Variations</Header>
                    <br />
                    <SelectVariation
                      variations={variations()}
                      defaultVal={UIStore.content.variationID}
                      whenChanged={handleChange}
                    />
                    <Button
                      style={{ display: "inline-block", marginLeft: 5 }}
                      onClick={e => handleEdit(e)}
                    >
                      Edit...
                    </Button>
                    <Button
                      color="blue"
                      style={{ display: "inline-block" }}
                        onClick={e => handleCreateNew(e)}
                    >
                      Create New...
                    </Button>
                  </div>
                  <br/>
                   <ManageVariationData 
                   variation={vari()} 
                   type={this.mode}
                /> 
                </Segment>
                <FeaturedImage
                  mode={this.mode}
                  defaultImgUrl={DataEntryStore.contentmgmt.img}
                  output={val => DataEntryStore.set("contentmgmt", "bundle", val)}
                />
                <AddToEmail 
                  mode={this.mode}
                  />
      
                <Keywords mode={this.mode} />
                <ReviewAlerts
                  defaultVal={DataEntryStore.contentmgmt.reviewAlert}
                  mode={this.mode}
                />
                <Schedule 
                state={obj.state} 
                mode={this.mode}
                 />
                <History mode={this.mode} />
                <Settings 
                mode={this.mode} 
                defaultChannel={DataEntryStore.contentmgmt.settingsChannel}
                />
      
                <br />
              </React.Fragment>
            )
        }
        
  

    }

    return <div style={{ maxWidth: 700 }}>{manageContent()}</div>;
  }
}
export default withRouter(ManageContent);