import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Button, Header, Segment, Menu, Dropdown } from "semantic-ui-react";
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
import { modifyPolicy, modifyAnnouncement } from "../../DataExchange/Up";


@inject( "TeamStore", "DataEntryStore", "PoliciesStore", "UIStore", "AnnouncementsStore", "EmailStore", "AccountStore")
@observer
class ManageContent extends React.Component {
  constructor(props) {
    super(props);
    const {UIStore} = this.props
    this.mode = this.props.location.pathname.includes("policy")
      ? "policy"
      : "announcement";
        UIStore.reset("content")
  }
  componentWillUnmount() {
    const {DataEntryStore} = this.props
    DataEntryStore.reset("contentmgmt")
   
  }

  componentDidMount() {
    const { UIStore, AnnouncementsStore, DataEntryStore, PoliciesStore, AccountStore } = this.props;
    if (this.mode === "policy") {
      if (
        UIStore.content.policyID === "" ||
        this.props.match.params.id !== UIStore.content.policyID ||
        DataEntryStore._isReset("contentmgmt")
      ) {
        if (!_.isEmpty(PoliciesStore._getPolicy(this.props.match.params.id))) {
          UIStore.set("content", "policyID", this.props.match.params.id);
          const obj = Object.assign( {}, PoliciesStore._getPolicy(UIStore.content.policyID) );
          UIStore.set( "content", "variationID", PoliciesStore._toggleGlobalVariation(obj.policyID) );
          DataEntryStore.set("contentmgmt", "label", obj.label);
          DataEntryStore.set("contentmgmt", "img", obj.img);
          // DataEntryStore.set("contentmgmt", "bundle", EmailStore.queue.bundleID);
          DataEntryStore.set("contentmgmt", "campaign", "new");
          DataEntryStore.set("contentmgmt", "keywords", obj.keywords);
          DataEntryStore.set("contentmgmt", "reviewAlert", obj.reviewAlert);
          DataEntryStore.set("contentmgmt", "settingsLabel", obj.label)
          DataEntryStore.set("contentmgmt", "settingsChannel", obj.chanID)
          DataEntryStore.set("contentmgmt", "everPublished", obj.everPublished)
          UIStore.set(
            "content",
            "variationID",
            PoliciesStore._toggleGlobalVariation(UIStore.content.policyID)
          );
        } else {
          this.props.history.push("/panel/faqs");
        }
      }
    } else if (this.mode === "announcement") {
      if (
        UIStore.content.announcementID === "" ||
        this.props.match.params.id !== UIStore.content.announcementID ||
        DataEntryStore._isReset("contentmgmt")
      ) {
        if (!_.isEmpty(AnnouncementsStore._getAnnouncement(this.props.match.params.id))) {
          UIStore.set("content", "announcementID", this.props.match.params.id);
          const obj = Object.assign(
            {},
            AnnouncementsStore._getAnnouncement(UIStore.content.announcementID)
          );
          UIStore.set(
            "content",
            "variationID",
            AnnouncementsStore._toggleGlobalVariation(obj.announcementID)
          );
          DataEntryStore.set("contentmgmt", "label", obj.label);
          DataEntryStore.set("contentmgmt", "img", obj.img);
          DataEntryStore.set("contentmgmt", "bundle", "queue");
          DataEntryStore.set("contentmgmt", "keywords", obj.keywords);
          DataEntryStore.set("contentmgmt", "reviewAlert", obj.reviewAlert)
          DataEntryStore.set("contentmgmt", "settingsLabel", obj.label)
          DataEntryStore.set("contentmgmt", "settingsChannel", obj.chanID)
          DataEntryStore.set("contentmgmt", "everPublished", obj.everPublished)
          UIStore.set(
            "content",
            "variationID",
            AnnouncementsStore._toggleGlobalVariation(
              UIStore.content.announcementID
            )
          );
        } else {
          this.props.history.push("/panel/announcements");
        }
      }
    }
  }

  render() {    
    
    const { TeamStore, DataEntryStore, PoliciesStore, AnnouncementsStore, UIStore, AccountStore } = this.props;

    const publishOptions = () => {
      const updateStage = (newStage) => {
        let allVaris = obj.variations.filter(i => i.variationID !== vari().variationID)
        allVaris.push(Object.assign(vari(), {stage: newStage}))
        let modifyContent = {variations: allVaris}
        const id = this.mode === "policy"? "policyID" : "announcementID"
        modifyContent[id] = obj[id]
        modifyContent["accountID"] = AccountStore.account.accountID
        this.mode === "policy"? modifyPolicy(modifyContent) : modifyAnnouncement(modifyContent)
      }
      const options = {
        "draft": <React.Fragment>
          <Dropdown.Item text='Publish' icon="rocket" onClick={e=>updateStage("published")}/>
          <Dropdown.Item text='Archive' icon="archive" onClick={e=>updateStage("archived")}/>
        </React.Fragment> ,
        "published": 
        <React.Fragment>
          <Dropdown.Item text='Unpublish' icon="remove circle" onClick={e=>updateStage("draft")}/>
          <Dropdown.Item text='Archive' icon="archive"  onClick={e=>updateStage("archived")}/>
      </React.Fragment>
        ,
        "archived": <React.Fragment>
        <Dropdown.Item text='Restore' icon="hand spock"  onClick={e=>updateStage("draft")}/>
      </React.Fragment>,
      }
      return options[vari().stage]
    }

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
      Object.assign( {}, PoliciesStore._getVariation( UIStore.content.policyID, UIStore.content.variationID ) )
      :
      Object.assign( {}, AnnouncementsStore._getVariation( UIStore.content.announcementID, UIStore.content.variationID ) )
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

      const handleCreateDupe = () => {
        const vari = this.mode === "policy"?
        Object.assign( {}, PoliciesStore._getVariation( UIStore.content.policyID, UIStore.content.variationID ) )
        :
        Object.assign( {}, AnnouncementsStore._getVariation( UIStore.content.announcementID, UIStore.content.variationID ) )
        UIStore.set("content", "variationID", generateID());
          DataEntryStore.set("content", "isNew", false);
          DataEntryStore.set("content", "stage", "draft");
          DataEntryStore.set("content", "contentRAW", vari.contentRAW)
          DataEntryStore.set("content", "contentHTML", vari.contentHTML)

          this.mode === "policy" ?
          this.props.history.push(
            "/panel/faqs/policy-variation/" + UIStore.content.variationID
          )
          :
          this.props.history.push(
            "/panel/announcements/announcement-variation/" + UIStore.content.variationID
          )
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
                        <Dropdown 
                        button size="small" style={{marginLeft: 5, fontWeight: 800}} text="actions..." icon={false}>
                    <Dropdown.Menu>
                      <Dropdown.Item text='Edit' icon="edit outline" onClick={e => handleEdit(e)} />
                      <Dropdown.Item text='New' icon="file outline" onClick={e => handleCreateNew(e)}/>
                      <Dropdown.Item text='Duplicate' icon="copy outline" onClick={e => handleCreateDupe(e)}/>
                      <Dropdown.Divider /> 
                    {publishOptions()}
                    </Dropdown.Menu>
                    </Dropdown>
                    <div>
                      
                    </div>
                
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

                {DataEntryStore.contentmgmt.everPublished?
                <AddToEmail 
                  mode={this.mode}
                  />: null}
      
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

    return <div style={{ maxWidth: 700 }}>{UIStore.content.variationID === ""? <div/> : manageContent()}</div>;
  }
}
export default withRouter(ManageContent);