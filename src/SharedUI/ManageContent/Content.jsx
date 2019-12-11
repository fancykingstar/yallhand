import React from "react";
import { inject, observer } from "mobx-react";
import FadeIn from 'react-fade-in'
import {TeamStore} from "../../Stores/TeamStore";
import {Row, Col} from "reactstrap";
import { Header, Input, Form, Dropdown, Button, Menu, Segment } from "semantic-ui-react";
import {Chip, Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { PublishControls } from "../../SharedUI/NewEditContent/PublishControls";

import {ChooseTargeting} from "../../SharedUI/ChooseTargeting";
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

@inject( "TeamStore", "DataEntryStore", "UIStore", "EmailStore", "AccountStore")
@observer
export class Content extends React.Component {
  constructor(props){
    super(props);
    this.state={showTargeting: false, activeItem:"", shouldBlockNavigation: true};
  }

  componentDidMount() {
    const { UIStore, DataEntryStore, AccountStore } = this.props;
    const mode = this.props.history.location.state.mode;

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
          this.props.history.push("/panel/faqs");
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
          this.props.history.push("/panel/announcements");
        }
      }
    }
  }

  componentDidUpdate = () => {
    if (this.state.shouldBlockNavigation) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
  }

  handleItemClick = (e, {name}) => {this.setState({active:name})}

  sectionStyle = {paddingTop: 10, paddingBottom: 10}
  managementStyle = {paddingTop: 10, paddingBottom: 10, display: "flex", flexWrap: "wrap"}

  variations = <><span>Variations</span><br/>
  <Chip color="primary" label="Global / No Tags" />  <Chip label="SF / Manager" /> 
  <Fab onClick={()=>this.setState({showTargeting: true})} style={{marginLeft: 5, marginTop: -3}} size="small"><AddIcon/></Fab></>

  variationTarget = <>
    <ChooseTargeting
      noPass
      NoSelectUsers 
      label={"share " + "FAQ"} 
      input= {""}
      output={val=> console.log(val)}
      />
  </>

  render(){
    const { TeamStore, DataEntryStore, UIStore, AccountStore, match } = this.props;
    const {showTargeting} = this.state;
    const mode = this.props.history.location.state.mode
    const menuItems = ["Featured Image","Channel", "Q and A" , "Searchability", "Review Alerts", "Schedule", "History", "Settings"].map(item => <Menu.Item
        name={item}
        active={this.state.activeItem === {item}}
        onClick={this.handleItemClick}
      />)
    const obj = mode === "policy" ?
      PoliciesStore._getPolicy(UIStore.content.policyID)
      : AnnouncementsStore._getAnnouncement(UIStore.content.announcementID)

    const { shouldBlockNavigation } = this.state;
    return(
      <>
        <HoldLeave value={shouldBlockNavigation} />
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
          <Form.Input style={{marginTop: -8}} className="FixSemanticLabel"  placeholder="Hi"><input maxLength={72}/></Form.Input>
        </Form>
        {showTargeting? this.variationTarget : this.variations}
        <div style={this.sectionStyle}>
          <Wysiwyg  error={false} loadContent={null} border output={e=>console.log(e)}/>
          <div>
            <Row style={{padding: "10px 0 10px 15px"}}>
              <PublishControls unsavedWarning={false} stage={"draft"} onClick={val => console.log(val)} />
              <Button>Preview</Button>
            </Row>
            <br/>
          </div>
        </div>
        <div style={this.managementStyle}>
          <Menu vertical> {menuItems} </Menu>
          <div style={{flex: 1, marginLeft: 10}}>
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
                  <div/>
                </FadeIn> : this.state.active === 'Searchability' ?
                <FadeIn delay="500" transitionDuration="500">
                  <div/>
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
          </div>
        </div>
      </>
    )
  }
}