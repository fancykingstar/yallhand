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
import { HoldLeave } from "../ConfirmLeave";
import Settings from "./Settings";
import { PoliciesStore } from "../../Stores/PoliciesStore";
import { AnnouncementsStore } from "../../Stores/AnnouncementsStore";
import CombinedContent from "../NewEditContent/CombinedContent";
import PreviewContent from "../NewEditContent/PreviewContent";
import isEmpty from 'lodash.isempty';
import { format } from 'timeago.js';
import UTCtoFriendly from "../../SharedCalculations/UTCtoFriendly"

@inject( "TeamStore", "DataEntryStore", "UIStore", "EmailStore", "AccountStore")
@observer
export class Content extends React.Component {
  constructor(props){
    super(props);
    const {match} = this.props;
    const obj = PoliciesStore._getPolicy(this.props.match.params.contentID);
    let variId = ""
    if (!_.isEmpty(obj)) variId = PoliciesStore._toggleGlobalVariation(obj.policyID);

    this.state={
      showTargeting: false,
      activeItem:"",
      loaded: false,
      mode: this.props.history.location.state.mode,
      contentID: match.params.contentID !== "content"? match.params.contentID:"", 
      variID: variId,
      isDupe: variId && this.props.match.params.option === "d",
      content: {},
      _contentPreview: false,
      teamID: "",
      width: 0
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  async loadContent() {
    const {mode, variID, contentID, isDupe} = this.state;
    if(!variID) {
      let isLoaded = {};
      if(contentID){
        isLoaded =  mode === "announcement"? AnnouncementsStore._getAnnouncement(this.props.match.params.contentID): PoliciesStore._getPolicy(contentID);
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
    const mode = this.props.history.location.state.mode;
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
          UIStore.set( "content", "variationID", PoliciesStore._toggleGlobalVariation(obj.policyID) );
          DataEntryStore.set("contentmgmt", "label", obj.label);
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
          UIStore.set(
            "content",
            "variationID",
            AnnouncementsStore._toggleGlobalVariation(obj.announcementID)
          );
          DataEntryStore.set("contentmgmt", "label", obj.label);
          DataEntryStore.set("contentmgmt", "img", obj.img);
          DataEntryStore.set("contentmgmt", "imgData", obj.imgData);
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
          {/*this.props.history.push("/panel/announcements");*/}
        }
      }
    }
    this.loadContent();

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
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

  sectionStyle = {paddingTop: 10, paddingBottom: 10}
  managementStyle = {paddingTop: 10, paddingBottom: 10, display: "flex", flexWrap: "wrap"}
  ownerStyle = { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }

  render(){
    const { TeamStore, DataEntryStore, UIStore, AccountStore, match } = this.props;
    const {showTargeting} = this.state;
    const mode = this.props.history.location.state.mode
    const menuItems = ["Featured Image","Channel", "Q and A" , "Searchability", "Review Alerts", "Schedule", "History", "Settings"].map(item => <Menu.Item
        name={item}
        active={this.state.activeItem === {item}}
        onClick={this.handleItemClick}
      />)

    const dropDownOptions = [
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
    if (variation) {
      let vari = variation.map(va => ({
        key: va.variationID,
        value: va.variationID,
        description: getDisplayTags(va.tags, TeamStore.tags),
        text: TeamStore.teamKey[va.teamID],
        type: va.type
      }));

      variat = variation.map((va, i) => {
        return (
          getDisplayTags(va.tags, TeamStore.tags).includes("No Tag") ? <Chip color={ i == 0 ? "primary" : "" } label={`${TeamStore.teamKey[va.teamID]} / ${getDisplayTags(va.tags, TeamStore.tags)}`} key={i} />
          : <Chip color={ i == 0 ? "primary" : "" } label={`${TeamStore.teamKey[va.teamID]} / ${getDisplayTags(va.tags, TeamStore.tags)[0]}`} key={i} />
        )
      })
    }

    const availableVariation = mode === "policy"? PoliciesStore._getVariation(UIStore.content.policyID, UIStore.content.variationID)
      : AnnouncementsStore._getVariation(UIStore.content.announcementID, UIStore.content.variationID);

    let owner = ""
    if (availableVariation && availableVariation.userID)
      owner = AccountStore._getDisplayName(availableVariation.userID);
    const lastUpdate = format(availableVariation.updated);

    const {content, isNewContent, isNewVari, variID} = this.state;
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
    const shouldBlockNavigation = UIStore.content.shouldBlockNavigation;

    return(
      <>
        <HoldLeave value={shouldBlockNavigation} />
        <BackButton/>
        { loaded && <PreviewContent data={this.state} /> }
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
          <Form.Input style={{marginTop: -8}} className="FixSemanticLabel"  placeholder="Hi">
              <input maxLength={72} value={this.props.match.params.contentID ? DataEntryStore.contentmgmt.label : ""} />
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
          {this.state.width > 767 ? <div style={{flex: 1, marginLeft: 10}}>
                      {
                        this.state.active === 'Featured Image' ?
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
                        this.state.active === 'Featured Image' ?
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