import React from "react";
import { inject, observer } from "mobx-react";
import { Prompt } from 'react-router'
import FadeIn from "react-fade-in";
import { Header, Input, Form, Dropdown, Button, Menu, Segment } from "semantic-ui-react";
import { Chip, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { ChooseTargeting } from "../../SharedUI/ChooseTargeting";
import { getDisplayTags } from "../../SharedCalculations/GetDisplayTags";
import BackButton from "../../SharedUI/BackButton";
import { FeaturedImage } from "./FeaturedImage";
import { AddToEmail } from "./AddToEmail";
import { Keywords } from "./Keywords";
import { ReviewAlerts } from "./ReviewAlerts";
import { Schedule } from "./Schedule";
import { History } from "./History";
import { Channel } from "./Channel";
import Settings from "./Settings";

import { ContentPreview } from "../../SharedUI/ContentPreview";
import TimeAgo from 'react-timeago';
import { AttachedFiles } from "../NewEditContent/AttachedFiles";
import VariationChip from "./VariationChip";
import { QandA } from "./QandA";
import { generateID } from "../../SharedCalculations/GenerateID";
import { Row, Col, } from 'reactstrap';
import { Wysiwyg } from "../../SharedUI/Wysiwyg";
import { PublishControls } from "../../SharedUI/NewEditContent/PublishControls";
import {getContentObj} from "../../SharedCalculations/GetContentObj";
import {getGlobalVari} from "../../SharedCalculations/GetContentObj";
import {isEmpty} from "lodash";
import { giveMeKey } from "../../SharedCalculations/GiveMeKey";

import { contentHistory, contentEdit, content } from "../../DataExchange/PayloadBuilder";
import { createHistory, createAnnouncement, createPolicy, modifyAnnouncement, modifyPolicy } from "../../DataExchange/Up"; 



@inject("DataEntryStore", "UIStore", "TeamStore", "UserStore", "AccountStore")
@observer
export class Content extends React.Component {
    constructor(props){
        super(props);
        this.state={
            labelSource: "parent",
            showVariations: true,
            showSegmentation: false,
            loaded: false,
            contentPreview: false,
            width: 0,
            activeItem: ""
        }
    }
    updateState(obj){this.setState(obj);}
    updateTargeting(val){
      const {DataEntryStore} = this.props;
      if (val.sendTargetType==="all"){
        DataEntryStore.set("contentmgmt", "teamID", "global")
        DataEntryStore.set("contentmgmt", "tags", [])
      }
      else {
        if (val.sendToTeamID) {
          DataEntryStore.set("contentmgmt", "teamID", val.sendToTeamID)
        }
        else {
          if (!val.sendToTagID || val.sendToTagID==="none") DataEntryStore.set("contentmgmt", "tags", []);
          else DataEntryStore.set("contentmgmt", "tags", [val.sendToTagID]);
        }
      }           
    };

    componentWillUnmount(){
        window.removeEventListener('resize', this.updateWindowDimensions);

        const {DataEntryStore, UIStore} = this.props;
        DataEntryStore.reset("contentmgmt");
        UIStore.reset("content");
   
    }

    leave(mode){
        this.props.history.push(`/panel/${mode === "announcement"? "announcements":"faqs"}`)
    }

    updateWindowDimensions() {
      this.setState({ width: window.innerWidth });
    }

    
    ejectContent(obj, mode, variID=false){
        const isNewVari = variID === "new";
        const {DataEntryStore, UIStore} = this.props;
        const contentID = obj[`${mode}ID`] || "new";
        const isNewContent = contentID === "new";
        const variationID = variID || getGlobalVari(obj);
        const variation = isNewVari? {} : getContentObj(obj, variationID).variations[0];
        //UIStore due to several references in additonal settings
         UIStore.set("content", `${mode}ID`, contentID);
         UIStore.set("content", "variationID", variationID);

         DataEntryStore.set("contentmgmt", "contentData", isNewContent? {} : obj, "*");
         DataEntryStore.set("contentmgmt", "variData", variation, "*");
         DataEntryStore.set("contentmgmt", "mode", mode, "*");
         DataEntryStore.set("contentmgmt", "contentLabel",  isNewContent? "" : obj.label, "*");
         DataEntryStore.set("contentmgmt", "variLabel", isNewVari? "" : variation.label, "*")
         DataEntryStore.set("contentmgmt", "contentRAW", isNewVari? null : variation.contentRAW, "*")
         DataEntryStore.set("contentmgmt", "contentHTML", isNewVari? "" : variation.contentHTML, "*")
         DataEntryStore.set("contentmgmt", "img",  isNewContent? "" : obj.img, "*");
         DataEntryStore.set("contentmgmt", "imgData",  isNewContent? {} : obj.imgData, "*");
         DataEntryStore.set("contentmgmt", "keywords",  isNewContent? [] : obj.keywords, "*");
         DataEntryStore.set("contentmgmt", "reviewAlert",  isNewContent? 0 : obj.reviewAlert, "*");
         DataEntryStore.set("contentmgmt", "chanID",  isNewContent? "All" : obj.chanID, "*")
         DataEntryStore.set("contentmgmt", "everPublished",  isNewContent? false : obj.everPublished, "*")
         DataEntryStore.set("contentmgmt", "qanda", variation.qanda || [], "*");

         DataEntryStore.set("contentmgmt", "updatedSinceReset", false);
         this.setState({labelSource: DataEntryStore.contentmgmt.variLabel? "vari":"parent", showSegmentation: isNewVari? true: false, loaded: true })

    }

    componentDidMount(){
         this.updateWindowDimensions();
         window.addEventListener('resize', this.updateWindowDimensions.bind(this));

         const {DataEntryStore} = this.props;
         DataEntryStore.reset("contentmgmt");

        const contentID = this.props.match.params.contentID;
        const mode = this.props.location.pathname.includes("faq")? "policy":"announcement";
        if (this.props.match.params.contentID === "content" && this.props.match.params.variID === "new") {
          this.ejectContent({}, mode, "new")
        }
        else if (contentID) {
            let id = {};
            id[mode + "ID"] = contentID;
            const toLoad = getContentObj(id);
            if (isEmpty(toLoad)) this.leave(mode);
            else {this.ejectContent(toLoad, mode)}
        }
        else this.leave(mode);
      
   
    }

    sectionStyle = {paddingTop: 10, paddingBottom: 10};
    ownerStyle = { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" };
    managementStyle = {paddingTop: 10, paddingBottom: 10, display: "flex", flexWrap: "wrap"};

    newVariant(){
        const {DataEntryStore} = this.props;
        const {contentData, mode} = DataEntryStore.contentmgmt;
        this.ejectContent(contentData, mode, "new")
    };

    onChangeVariation(variID){
        const {DataEntryStore} = this.props;
        const {contentData, mode} = DataEntryStore.contentmgmt;
        this.ejectContent(contentData, mode, variID)
    };

    
    async changeStage(stage) {
      const { UIStore, DataEntryStore, history } = this.props;
      const { variationID } = UIStore.content;
      const {mode} = DataEntryStore.contentmgmt;
      const isNewContent = UIStore.content[`${mode}ID`] === "new";

      // if (!this.isValid()) {
      //   return;
      // }

      const isPolicy = mode === "policy";
      const path = isPolicy ? `/panel/faqs/` : `/panel/announcements/`;
      const typeId = `${mode}ID`;
      const contentID = isNewContent? "" : UIStore.content[typeId];
      const payload = Object.assign(DataEntryStore.contentmgmt, {stage});

      if (stage === "published") {
        const historyMode = contentHistory(mode, contentID, content(payload));
        await createHistory(historyMode);
      }

      if (isNewContent) {
        const res = isPolicy?  await createPolicy(content(payload)) : await createAnnouncement(content(payload));
        const id = res[typeId];
        await DataEntryStore.set("contentmgmt", "updatedSinceReset", false);
        this.props.history.push(`${path}`)
      }


      else {
        if (isPolicy) await modifyPolicy(contentEdit(payload, mode, contentID, variationID));
        else await modifyAnnouncement(contentEdit(payload, mode, contentID, variationID));
        await DataEntryStore.set("contentmgmt", "updatedSinceReset", false);
        this.props.history.push(`${path}`);
      }

    }

  render() {
      const {DataEntryStore, TeamStore, UserStore, AccountStore, UIStore} = this.props;
      const {labelSource, showVariations, showSegmentation, loaded, contentPreview, width, activeItem} = this.state;
      const {variData,mode} = DataEntryStore.contentmgmt;
      const isNewContent = UIStore.content[`${mode}ID`] === "new";
      const isNewVari = UIStore.content.variationID === "new";

      const variChips = (DataEntryStore.contentmgmt.contentData.variations || []).map((vari, i) => 
             vari.variationID === UIStore.content.variationID?
             <VariationChip label={`${TeamStore.teamKey[vari.teamID]} / ${getDisplayTags(vari.tags, TeamStore.tags)}`} key={giveMeKey()+ "variChip"} /> 
             :<div key={giveMeKey()+ "variChip"} style={{ marginRight: 5 }}><Chip style={{ marginRight: 10 }}  variant="outlined" color="primary" label={`${TeamStore.teamKey[vari.teamID]} / ${getDisplayTags(vari.tags, TeamStore.tags)}`} key={giveMeKey()+ "variChip"} onClick={() => this.onChangeVariation(vari.variationID)} /></div> 
      );
   
      const getPreviewObj = () => Object.assign({mode, label: DataEntryStore.contentmgmt.contentLabel, img: DataEntryStore.contentmgmt.img, variations: [{variationID: UIStore.content.variationID, label: DataEntryStore.contentmgmt.variLabel, contentRAW: DataEntryStore.contentmgmt.contentRAW, contentHTML: DataEntryStore.contentmgmt.contentHTML, qanda: DataEntryStore.contentmgmt.qanda, userID: UserStore.user.userID, updated: Date.now()}]}, mode === "policy"? {policyID: UIStore.content[`${mode}ID`]}:{announcmentID: UIStore.content[`${mode}ID`]});
 
      const variMenuItems = ["Attached Files", "Question and Answer"].map(item => 
        <Menu.Item
          key={giveMeKey()+"contentMenuItem"}
          name={item}
          active={activeItem === item}
          onClick={() => this.updateState({activeItem: item})}
          disabled={isNewVari}
        />)
  
      const parentMenuItems = ["Featured Image","Channel", "Email Campaign" , "Searchability", "Review Alerts", "Schedule", "History", "Settings"].map(item => 
        <Menu.Item
         key={giveMeKey()+"contentMenuItem"}
          name={item}
          active={activeItem === item}
          onClick={() => this.updateState({activeItem: item})}
          disabled={isNewVari}
        />)
  
      const menuItems = 
      <>
      <Menu.Item><Menu.Header>Variation Settings</Menu.Header><Menu.Menu> {variMenuItems}</Menu.Menu></Menu.Item>
      <Menu.Item><Menu.Header>General Settings</Menu.Header><Menu.Menu> {parentMenuItems}</Menu.Menu></Menu.Item>
      </>

    return (
      <>
        <BackButton />
        <Prompt
            when={DataEntryStore.contentmgmt.updatedSinceReset}
            message='You have unsaved changes, are you sure you want to leave this page?'
          />
        <Header as="h2" style={{ padding: 0, margin: 0 }}>
          Manage Content
          <Header.Subheader>
            {mode === "policy" ? "FAQ" : "Announcement"}
          </Header.Subheader>
        </Header>
        <Form style={this.sectionStyle} >
          <Form.Dropdown
            value={ labelSource }
            options={[ { text: "Parent Title", value: "parent" }, { text: "Variation Title", value: "vari", disabled: isNewContent } ]}
            onChange={(e, {value}) => this.updateState({labelSource: value})}
          />
          <Form.Input style={{ marginTop: -8 }} className="FixSemanticLabel">
            <input
              maxLength={72}
              value={ labelSource === "parent"? DataEntryStore.contentmgmt.contentLabel : DataEntryStore.contentmgmt.variLabel }
              onChange={(e) => {labelSource === "parent"? DataEntryStore.set("contentmgmt", "contentLabel",  e.currentTarget.value) : DataEntryStore.set("contentmgmt", "variLabel",  e.currentTarget.value) }}
            />
          </Form.Input>
        </Form>
        <div style={this.ownerStyle}>
          <div>
          
            {showVariations && !showSegmentation? <><span>Variations</span><br/><div style={{ display: "flex", flexWrap: "wrap" }}>{variChips}
            <Fab onClick={()=>this.newVariant()} style={{marginLeft: 5, marginTop: -3}} size="small"><AddIcon/></Fab></div></> : "" }
            {showVariations && showSegmentation? 
            <ChooseTargeting
            noPass
            NoSelectUsers 
            label={"share " + mode} 
            input= {isNewVari? false : {sendTargetType: variData.teamID === "global" && !variData.tags.length? "all": "teams", sendToTeamID: !this.state.teamID?  variData.teamID : this.state.teamID, sendToTagID: this.state.tagID? this.state.tagID :  variData.tags.length? "":  variData.tags[0]}}
            output={val=> this.updateTargeting(val) } />
            : ""}

          </div>
          <div className={isNewVari? "YHHidden" : "YHShow"} style={{ paddingTop: "20px" }}>
            <span style={{ fontSize: ".9em", paddingRight: "20px" }}>
              Owner: <b>{loaded? AccountStore._getDisplayName(DataEntryStore.contentmgmt.variData.userID): ""}</b>
            </span>
            <span style={{ fontSize: ".9em" }}>
             Last Update: <b> {loaded? <TimeAgo date={DataEntryStore.contentmgmt.variData.updated} /> : "" }</b>
            </span>
          </div>
        </div>
        <div style={this.sectionStyle} >
          {loaded && (
            <>
               <div>
       
               {loaded && 
               <ContentPreview  
                data={getPreviewObj()} 
                open={contentPreview} 
                onClose={() => this.updateState({contentPreview: false})} 
                />
                }
               
                <Wysiwyg  
                error={false} 
                variID={UIStore.content.variationID} 
                isNewVari={isNewVari} 
                loadContent={DataEntryStore.contentmgmt.contentRAW} 
                border 
                output={e=> {DataEntryStore.set("contentmgmt", "contentRAW", e.raw);DataEntryStore.set("contentmgmt", "contentHTML", e.html)}}
                />

                <div>
                    <Row style={{padding: "10px 0 10px 15px"}}>
                        <PublishControls 
                        unsavedWarning={isNewVari} 
                        stage={isNewContent? "draft" : isNewVari? "draft" : DataEntryStore.contentmgmt.variData.stage} 
                        onClick={val => this.changeStage(val)} 
                        />

                        <Button onClick={()=>this.updateState({contentPreview: true})}>Preview</Button>
                        {isNewVari && <Button onClick={()=>this.leave()}>Cancel</Button>}
                    </Row>
                    <br/>
                </div>
                </div>
            </>
          )}
        </div>
        <div style={this.managementStyle}>
          {this.state.width > 767 ? (
            <Menu vertical> {menuItems} </Menu>
          ) : (
            <Dropdown
              placeholder="Please select"
              fluid
              selection
              options={
                [
                  {key: "Attached Files", value:"Attached Files" , text: "Attached Files"},
                  {key: "Featured Image", value:"Featured Image" , text: "Featured Image"},
                  {key: "Channel", value:"Channel" , text: "Channel"},
                  {key: "Question and Answer", value:"Question and Answer" , text: "Question and Answer"},
                  {key: "Email Campaign" , value: "Email Campaign" , text: "Email Campaign"},
                  {key: "Searchability", value:"Searchability" , text: "Searchability"},
                  {key: "Review Alerts", value:"Review Alerts" , text: "Review Alerts"},
                  {key: "Schedule", value:"Schedule" , text: "Schedule"},
                  {key: "History", value:"History" , text: "History"},
                  {key: "Settings", value: "Settings", text: "Settings"},
                ]
              }
              onChange={(e, {value}) => { this.updateState({activeItem: value}); }}
              disabled={isNewVari}
            />
          )}
          {isNewVari ? (
            <div style={{ flex: 1, marginTop: 20, textAlign: "center" }}>
              Save a draft or publish to access additional settings.
            </div>
          ) : width > 767 ? (
            <div style={{ flex: 1, marginLeft: 10 }}>
               {activeItem === "Attached Files" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <Segment disabled={isNewVari}> <AttachedFiles mode={mode}  /> </Segment> 
               </FadeIn> ) 
            
               : activeItem === "Featured Image" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <FeaturedImage
                    mode={mode}
                    defaultImgUrl={DataEntryStore.contentmgmt.img}
                    imgData={DataEntryStore.contentmgmt.imgData}
                  />
              </FadeIn> 
                )  : activeItem === "Channel" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <Channel
                    mode={mode}
                    defaultChannel={DataEntryStore.contentmgmt.chanID}
                    submitButton
                  />
                </FadeIn>
              ) : activeItem === "Question and Answer" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <QandA
                    mode={mode}
                    content={mode === "announcement"? UIStore.content.announcmentID : UIStore.content.policyID}
                    vari={UIStore.content.variationID}
                  />
                </FadeIn>
              ) : activeItem === "Email Campaign" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <AddToEmail mode={mode} />
                </FadeIn>
              ) : activeItem === "Searchability" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <Keywords mode={mode} />
                </FadeIn>
              ) : activeItem === "Review Alerts" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <ReviewAlerts
                    defaultVal={DataEntryStore.contentmgmt.reviewAlert}
                    mode={mode}
                  />
                </FadeIn>
              ) : activeItem === "Schedule" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <Schedule state={DataEntryStore.contentmgmt.contentData._state} mode={mode} />
                </FadeIn>
              ) : activeItem === "History" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <History mode={mode} />
                </FadeIn>
              ) : activeItem === "Settings" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <Settings
                    mode={mode}
                    defaultChannel={DataEntryStore.contentmgmt.settingsChannel}
                  />
                </FadeIn>
              ) : ( 
                <div />
              )}
            </div>
          ) : (
            <div style={{ flex: 1, marginTop: 20 }}>
              {activeItem === "Attached File" ? (
                <FadeIn delay="500" transitionDuration="500">
                  {attachFiles}
                </FadeIn>
              ) : activeItem === "Featured Image" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <FeaturedImage
                    mode={mode}
                    defaultImgUrl={DataEntryStore.contentmgmt.img}
                    imgData={DataEntryStore.contentmgmt.imgData}
                  />
                </FadeIn>
              ) : activeItem === "Channel" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <Channel
                    mode={mode}
                    defaultChannel={DataEntryStore.contentmgmt.settingsChannel}
                    submitButton
                  />
                </FadeIn>
              ) : activeItem === "Question and Answer" ? (
              <FadeIn delay="500" transitionDuration="500">
                <QandA
                  mode={mode}
                  content={mode === "announcement"? UIStore.content.announcmentID : UIStore.content.policyID}
                  vari={UIStore.content.variationID}
                />
              </FadeIn>
              ) : activeItem === "Email Campaign" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <AddToEmail mode={mode} />
                </FadeIn>
              ) : activeItem === "Searchability" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <Keywords mode={mode} />
                </FadeIn>
              ) : activeItem === "Review Alerts" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <ReviewAlerts
                    defaultVal={DataEntryStore.contentmgmt.reviewAlert}
                    mode={mode}
                  />
                </FadeIn>
              ) : activeItem === "Schedule" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <Schedule state={obj.state} mode={mode} />
                </FadeIn>
              ) : activeItem === "History" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <History mode={mode} />
                </FadeIn>
              ) : activeItem === "Settings" ? (
                <FadeIn delay="500" transitionDuration="500">
                  <Settings
                    mode={mode}
                    defaultChannel={DataEntryStore.contentmgmt.settingsChannel}
                  />
                </FadeIn>
              ) : (
                <div />
              )}
            </div>
          )}
        </div>
      </>
    );
  }
}
