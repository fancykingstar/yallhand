import React from "react";
import { inject, observer } from "mobx-react";
import FadeIn from 'react-fade-in'
import {TeamStore} from "../../Stores/TeamStore";
import {Row, Col} from "reactstrap";
import { Header, Input, Form, Dropdown, Button, Menu, Segment, } from "semantic-ui-react";
import {Chip, Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { PublishControls } from "../../SharedUI/NewEditContent/PublishControls";

import {ChooseTargeting} from "../../SharedUI/ChooseTargeting";
import { getDisplayTags } from "../../SharedCalculations/GetDisplayTags";
import {Wysiwyg} from "../../SharedUI/Wysiwyg";
import BackButton  from "../../SharedUI/BackButton";
import { FeaturedImage } from "./FeaturedImage";
import { AddToEmail } from "./AddToEmail";
import { Keywords } from "./Keywords";
import { ReviewAlerts } from "./ReviewAlerts";
import { Schedule } from "./Schedule";
import { History } from "./History";
import { Channel } from "./Channel";
import Settings from "./Settings";
import { PoliciesStore } from "../../Stores/PoliciesStore";
import { AnnouncementsStore } from "../../Stores/AnnouncementsStore";
import CombinedContent from "../NewEditContent/CombinedContent";
import PreviewContent from "../NewEditContent/PreviewContent";
import isEmpty from 'lodash.isempty';
import { format } from 'timeago.js';
import UTCtoFriendly from "../../SharedCalculations/UTCtoFriendly"
import { AttachedFiles } from "../NewEditContent/AttachedFiles";

@inject( "TeamStore", "DataEntryStore", "UIStore", "EmailStore", "AccountStore", "UserStore")
@observer
export class Content extends React.Component {
  constructor(props){
    super(props);
    const {match, UIStore} = this.props;

    this.mode = this.props.location.pathname.includes("faq")
      ? "policy"
      : "announcement";

    let obj = PoliciesStore._getPolicy(this.props.match.params.contentID);
    this.mode === "policy" ? obj = obj : obj = Object.assign(
            {},
            AnnouncementsStore._getAnnouncement(UIStore.content.announcementID)
          );
    let variId = ""
    if (!_.isEmpty(obj)) variId = obj.variations[0].variationID;

    this.state={
      showTargeting: false,
      activeItem:"",
      loaded: false,
      mode: this.mode,
      contentID: match.params.contentID !== "content"? match.params.contentID:"", 
      variID: variId,
      isDupe: variId && this.props.match.params.option === "d",
      content: {},
      _contentPreview: false,
      teamID: "",
      width: 0,
      availVariation: 0
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  async loadContent() {
    const {mode, variID, contentID, isDupe} = this.state;
    if(!variID) {
      let isLoaded = {};
      if(contentID){
        isLoaded = mode === "announcement"? AnnouncementsStore._getAnnouncement(this.props.match.params.contentID): PoliciesStore._getPolicy(contentID);
      }
      this.setState({loaded:true, content: isLoaded, isNewContent: Boolean(!contentID), isNewVari: true});
      return
    }

    const isLoaded = mode === "announcement"? AnnouncementsStore._searchVariation(variID): PoliciesStore._searchVariation(variID);
    await this.setState({content: isLoaded, loaded:true, isNewContent: Boolean(!contentID), isNewVari: Boolean(!variID)});
    if((variID && isEmpty(isLoaded)) || (!isDupe && this.props.match.params.options ) ) this.props.history.push(`/panel/${mode === "announcement"? "announcements":"faqs"}`);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    const { UIStore, DataEntryStore, AccountStore } = this.props;
    const mode = this.mode;
    if (!this.props.match.params.contentID) {
      this.setState({showTargeting: true});
    }

    if (mode === "policy") {
      if (
        UIStore.content.policyID === "" ||
        this.props.match.params.contentID !== UIStore.content.policyID ||
        DataEntryStore._isReset("contentmgmt")
      ) {
        const obj = PoliciesStore._getPolicy(this.props.match.params.contentID);
        if (!_.isEmpty(obj)) {
          UIStore.set("content", "policyID", this.props.match.params.contentID);
          UIStore.set("content", "variationID", obj.variations[0].variationID);
          obj.variations.length > 0 ? obj.variations[0].label !="" ? DataEntryStore.set("contentmgmt", "label", obj.variations[0].label) : DataEntryStore.set("contentmgmt", "label", obj.label) : DataEntryStore.set("contentmgmt", "label", obj.label)
          DataEntryStore.set("contentmgmt", "img", obj.img);
          DataEntryStore.set("contentmgmt", "imgData", obj.imgData);
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
          {/*this.props.history.push("/panel/faqs");*/}
        }
      }
    } else if (mode === "announcement") {
      if (
        UIStore.content.announcementID === "" ||
        this.props.match.params.contentID !== UIStore.content.announcementID ||
        DataEntryStore._isReset("contentmgmt")
      ) {
        if (!_.isEmpty(AnnouncementsStore._getAnnouncement(this.props.match.params.contentID))) {
          UIStore.set("content", "announcementID", this.props.match.params.contentID);
          const obj = Object.assign(
            {},
            AnnouncementsStore._getAnnouncement(UIStore.content.announcementID)
          );
          UIStore.set("content", "variationID", obj.variations[0].variationID);
          obj.variations.length > 0 ? obj.variations[0].label !="" ? DataEntryStore.set("contentmgmt", "label", obj.variations[0].label) : DataEntryStore.set("contentmgmt", "label", obj.label) : DataEntryStore.set("contentmgmt", "label", obj.label)
          DataEntryStore.set("contentmgmt", "img", obj.img);
          DataEntryStore.set("contentmgmt", "imgData", obj.imgData);
          DataEntryStore.set("contentmgmt", "bundle", "queue");
          DataEntryStore.set("contentmgmt", "keywords", obj.keywords);
          DataEntryStore.set("contentmgmt", "reviewAlert", obj.reviewAlert)
          DataEntryStore.set("contentmgmt", "settingsLabel", obj.label)
          DataEntryStore.set("contentmgmt", "settingsChannel", obj.chanID)
          DataEntryStore.set("contentmgmt", "everPublished", obj.everPublished)
        } else {
          {/*this.props.history.push("/panel/announcements");*/}
        }
      }
    }
    this.loadContent();

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    const {DataEntryStore, UIStore} = this.props
    DataEntryStore.reset("contentmgmt")
    UIStore.reset("content");
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth });
  }

  componentDidUpdate = () => {
    const {UIStore} = this.props;
    if (UIStore.content.shouldBlockNavigation) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
  }

  isValid = () => {
    const {isNewContent,variID} = this.props.data;
    const conditions = {
      Title: isNewContent? this.state.label : true,
      Body: !this.state.contentHTML && !variID? false : true,
    }
   const result = validate(conditions);
   this.setState({_errors: result.errors});
   return result.valid
  }

  async changeStage(stage) {
    const { UIStore, history } = this.props;
    const {mode, isNewContent, contentID, variID} = this.state;
    if (!this.isValid()) {
      return;
    }

    await this.setState({stage});

    const isPolicy = mode === "policy";
    const path = isPolicy ? `/panel/faqs/` : `/panel/announcements/`;
    const typeId = `${mode}ID`;



    if (stage === "published") {
      const historyMode = contentHistory(mode, contentID, content(this.state));
      createHistory(historyMode);
    }

    if (isNewContent) {
      const res = isPolicy?  await createPolicy(content(this.state)) : await createAnnouncement(content(this.state));
      const id = res[typeId];
      await this.reset();
      await history.push(`${path}${res[id]}`)
    }


    else {
      contentEdit(this.state, mode, contentID, variID)
      if (isPolicy) await modifyPolicy(contentEdit(this.state, mode, contentID, variID));
      else await modifyAnnouncement(contentEdit(this.state, mode, contentID, variID));
      await this.reset();
      await history.push(`${path}${UIStore.content[mode + "ID"]}`);
    }

  }

  handleItemClick = (e, {name}) => {this.setState({active:name})}
  handleClick = (e, idx) => {this.setState({active: idx.value})}

  onChangeTitle = e => {
    const { DataEntryStore } = this.props;
    this.setState({label: e.target.value});
    DataEntryStore.set("contentmgmt", "label", e.target.value);
  }

  sectionStyle = {paddingTop: 10, paddingBottom: 10}
  managementStyle = {paddingTop: 10, paddingBottom: 10, display: "flex", flexWrap: "wrap"}
  ownerStyle = { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }

  onChangeVariation = (e, index) => {
    const { UIStore, DataEntryStore } = this.props;
    const obj = this.mode === "policy" ?
      PoliciesStore._getPolicy(UIStore.content.policyID)
      : AnnouncementsStore._getAnnouncement(UIStore.content.announcementID)
    this.setState({availVariation: index});
    this.setState({variID: obj.variations[index].variationID});
    UIStore.set("content", "variationID", obj.variations[index].variationID);
    obj.variations[index].label != "" ? DataEntryStore.set("contentmgmt", "label", obj.variations[index].label) : DataEntryStore.set("contentmgmt", "label", obj.label)
  }

  render(){
    const { TeamStore, DataEntryStore, UIStore, AccountStore, match } = this.props;
    const {showTargeting} = this.state;
    const mode = this.mode;
    const {content, isNewContent, isNewVari, variID} = this.state;
    const menuItems = ["Attached File", "Featured Image","Channel", "Q and A" , "Searchability", "Review Alerts", "Schedule", "History", "Settings"].map(item => 
      <Menu.Item
        name={item}
        active={this.state.activeItem === {item}}
        onClick={this.handleItemClick}
        disabled={isNewContent}
      />)

    const dropDownOptions = [
      {key: "Attached File", value:"Attached File" , text: "Attached File"},
      {key: "Featured Image", value:"Featured Image" , text: "Featured Image"},
      {key: "Channel", value:"Channel" , text: "Channel"},
      {key: "Q and A" , value: "Q and A" , text: "Q and A"},
      {key: "Searchability", value:"Searchability" , text: "Searchability"},
      {key: "Review Alerts", value:"Review Alerts" , text: "Review Alerts"},
      {key: "Schedule", value:"Schedule" , text: "Schedule"},
      {key: "History", value:"History" , text: "History"},
      {key: "Settings", value: "Settings", text: "Settings"},
    ]
    const obj = mode === "policy" ?
      PoliciesStore._getPolicy(UIStore.content.policyID)
      : AnnouncementsStore._getAnnouncement(UIStore.content.announcementID)

    let variation = (obj.variations || []).filter(variation => {return variation.variationID == UIStore.content.variationID})
    let variat = "";
    variat = (obj.variations || []).map((va, i) => {
        return (
          getDisplayTags(va.tags, TeamStore.tags).includes("No Tag") ? <Chip style={{ marginRight: 10 }} color={ i == this.state.availVariation ? "primary" : "default" } label={`${TeamStore.teamKey[va.teamID]} / ${getDisplayTags(va.tags, TeamStore.tags)}`} key={i} onClick={(e) => this.onChangeVariation(e, i)} />
          : <Chip style={{ marginRight: 10 }} color={ i == this.state.availVariation ? "primary" : "default" } label={`${TeamStore.teamKey[va.teamID]} / ${getDisplayTags(va.tags, TeamStore.tags)[0]}`} key={i} onClick={(e) => this.onChangeVariation(e, i)} />
        )
      })
    if (variation) {
      let vari = variation.map(va => ({
        key: va.variationID,
        value: va.variationID,
        description: getDisplayTags(va.tags, TeamStore.tags),
        text: TeamStore.teamKey[va.teamID],
        type: va.type
      }));
    }

    const availableVariation = mode === "policy"? PoliciesStore._getVariation(UIStore.content.policyID, UIStore.content.variationID)
      : AnnouncementsStore._getVariation(UIStore.content.announcementID, UIStore.content.variationID);

    const { UserStore } = this.props;
    let owner = AccountStore._getDisplayName(UserStore.user.userID);
    if (availableVariation && availableVariation.userID)
      owner = AccountStore._getDisplayName(availableVariation.userID);
    const lastUpdate = format(availableVariation.updated);

    const mod = this.state.mode;
    let vari = {};
    let variationTarget = ""
    if (isNewVari !== undefined) {
      vari = isNewVari? {} : content.variations.filter(v => v.variationID === variID)
    
      variationTarget = <>
        <ChooseTargeting
          noPass
          NoSelectUsers 
          label={"share " + mod} 
          input= {isNewVari? false : {sendTargetType: vari[0].teamID === "global" && !vari[0].tags.length? "all": "teams", sendToTeamID: !this.state.teamID? vari[0].teamID : this.state.teamID, sendToTagID: this.state.tagID? this.state.tagID : !vari[0].tags.length? "": vari[0].tags[0]}}
          output={val=> this.setState(val.sendTargetType==="all"? {"teamID": "global", "tags": []}: val.sendToTeamID? {teamID:val.sendToTeamID}:{tags: !val.sendToTagID || val.sendToTagID==="none"? []:[val.sendToTagID]})}
        />
      </>
    }

    const { loaded } = this.state;

    const attachFiles = isNewContent? <span style={{fontSize: "0.9em",fontWeight: '400', fontStyle: 'italic'}}>Want to attach a file? Please save as a draft first</span>
      : <Segment disabled={isNewContent}>
          <AttachedFiles mode={mode}  />
        </Segment>


    return(
      <>
        <BackButton/>
        <Header as="h2"
          style={{padding: 0, margin: 0}}
        >
          Manage Content
          <Header.Subheader>
              {mode === 'policy'? "FAQ" : "Announcement"}
          </Header.Subheader>
        </Header>
        <Form style={this.sectionStyle}>  
          <Form.Dropdown defaultValue={"parent"} options={[{text: "Parent Title", value: "parent"},{text:"Variation Title", value: "vari"}]} />
          <Form.Input style={{marginTop: -8}} className="FixSemanticLabel">
              <input maxLength={72} value={this.props.match.params.contentID ? DataEntryStore.contentmgmt.label : ""} onChange={e => this.onChangeTitle(e)} />
          </Form.Input>
        </Form>
        <div style={this.ownerStyle}>
          <div>
          {showTargeting? variationTarget : <><span>Variations</span><br/>{variat}<Fab onClick={()=>this.setState({showTargeting: true})} style={{marginLeft: 5, marginTop: -3}} size="small"><AddIcon/></Fab></>}
          </div>
          <div style={{ paddingTop: "20px" }}>
            <span style={{fontSize: ".9em", paddingRight: "20px"}}>Owner: <b>{owner}</b></span>
            <span style={{fontSize: ".9em"}}>Last Update: <b>{lastUpdate}</b></span>
          </div>
        </div>
        <div style={this.sectionStyle}>
          {loaded &&
            <>
              <CombinedContent data={this.state}/>
            </>
          }
{/*          <div>
            <Row style={{padding: "10px 0 10px 15px"}}>
              <PublishControls unsavedWarning={isNewContent} stage={isNewContent? "draft" : isNewVari? "draft" : vari[0].stage} onClick={val => this.changeStage(val)} />
              <Button onClick={() => this.setState({_contentPreview: true})}>Preview</Button>
            </Row>
            <br/>
          </div>*/}
        </div>
        <div style={this.managementStyle}>
          {
            this.state.width > 767 ? <Menu vertical> {menuItems} </Menu> : <Dropdown
              placeholder='Please select'
              fluid
              selection
              options={dropDownOptions}
              onChange={(e, inx) => {this.handleClick(e, inx)}}
            />
          }
          {
            isNewContent ? <div style={{flex: 1, marginTop: 20, textAlign: "center"}}>Save a draft or publish to access additional settings.</div> :
              this.state.width > 767 ? <div style={{flex: 1, marginLeft: 10}}>
                      {
                        this.state.active === 'Attached File' ?
                          <FadeIn delay="500" transitionDuration="500">
                            {attachFiles}
                          </FadeIn> : this.state.active === 'Featured Image' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <FeaturedImage
                              mode={mode}
                              defaultImgUrl={DataEntryStore.contentmgmt.img}
                              imgData={DataEntryStore.contentmgmt.imgData}
                            />
                          </FadeIn> : this.state.active === 'Channel' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <Channel 
                              mode={mode}
                              defaultChannel={DataEntryStore.contentmgmt.settingsChannel}
                              submitButton
                            />
                          </FadeIn> : this.state.active === 'Q and A' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <AddToEmail
                              mode={mode}
                            />
                          </FadeIn> : this.state.active === 'Searchability' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <Keywords mode={mode} />
                          </FadeIn> : this.state.active === 'Review Alerts' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <ReviewAlerts
                              defaultVal={DataEntryStore.contentmgmt.reviewAlert}
                              mode={mode}
                            />
                          </FadeIn> : this.state.active === 'Schedule' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <Schedule
                              state={obj.state}
                              mode={mode}
                            />
                          </FadeIn> : this.state.active === 'History' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <History mode={mode} />
                          </FadeIn> : this.state.active === 'Settings' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <Settings
                              mode={mode}
                              defaultChannel={DataEntryStore.contentmgmt.settingsChannel}
                            />
                          </FadeIn> : <div />
                      }
                    </div> :
                    <div style={{flex: 1, marginTop: 20}}>
                      {
                        this.state.active === 'Attached File' ?
                          <FadeIn delay="500" transitionDuration="500">
                            {attachFiles}
                          </FadeIn> : this.state.active === 'Featured Image' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <FeaturedImage
                              mode={mode}
                              defaultImgUrl={DataEntryStore.contentmgmt.img}
                              imgData={DataEntryStore.contentmgmt.imgData}
                            />
                          </FadeIn> : this.state.active === 'Channel' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <Channel 
                              mode={mode}
                              defaultChannel={DataEntryStore.contentmgmt.settingsChannel}
                              submitButton
                            />
                          </FadeIn> : this.state.active === 'Q and A' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <AddToEmail
                              mode={mode}
                            />
                          </FadeIn> : this.state.active === 'Searchability' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <Keywords mode={mode} />
                          </FadeIn> : this.state.active === 'Review Alerts' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <ReviewAlerts
                              defaultVal={DataEntryStore.contentmgmt.reviewAlert}
                              mode={mode}
                            />
                          </FadeIn> : this.state.active === 'Schedule' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <Schedule
                              state={obj.state}
                              mode={mode}
                            />
                          </FadeIn> : this.state.active === 'History' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <History mode={mode} />
                          </FadeIn> : this.state.active === 'Settings' ?
                          <FadeIn delay="500" transitionDuration="500">
                            <Settings
                              mode={mode}
                              defaultChannel={DataEntryStore.contentmgmt.settingsChannel}
                            />
                          </FadeIn> : <div />
                      }
                    </div>}
        </div>
      </>
    )
  }
}