import React from "react";
import { inject, observer } from "mobx-react";
import { Prompt } from 'react-router'
import { Segment, Button, Dropdown, Menu, Header } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import { Row, Col, } from 'reactstrap';

import BackButton  from "../../SharedUI/BackButton";
import { AttachedFiles } from "./AttachedFiles";
import { Wysiwyg } from "../../SharedUI/Wysiwyg";
import { ChooseTargeting } from "../../SharedUI/ChooseTargeting";
import { PublishControls } from "../../SharedUI/NewEditContent/PublishControls";
import { CommonOptions } from "../../SharedUI/NewEditContent/CommonOptions";
import { ContentPreview } from "../../SharedUI/ContentPreview";

import { FeaturedImage } from "../ManageContent/FeaturedImage";
import { Channel } from "../ManageContent/Channel";

import { createPolicy, createAnnouncement, modifyPolicy, modifyAnnouncement, createHistory } from "../../DataExchange/Up"
import { content, contentEdit, contentHistory } from "../../DataExchange/PayloadBuilder"
import { validate } from "../../SharedCalculations/ValidationTemplate"

// import toast from "../../YallToast"
import _ from "lodash";
import { UserStore } from "../../Stores/UserStore";

@inject("DataEntryStore", "UIStore", "AnnouncementsStore", "PoliciesStore", "TeamStore")
@observer
class VariationContent extends React.Component {
  constructor(props){
    super(props);
    this.state={};
  }
  reset() {
    this.setState({   
      label: "",
      contentRAW: "",
      contentHTML: "",
      teamID: "",
      tags: [],
      stage: "",
      img: "",
      imgData: "",
      chanID: "",
      resourceID: "",
      _options: "",
      _contentPreview: false,
      _audience_target: "",
      _errors: []
    })
  }
  
  componentDidMount(){ 
    this.reset();
  }

  updateDraft = (e) => this.setState({contentRAW: e.raw, contentHTML: e.html});

  togglePreview = (bool) => this.setState({_contentPreview: bool});

  hasBeenChanged() { 
    return Boolean(Object.values(this.state).filter(i=>i.length).length); 
  }
  
  contentPreviewData = () => {
    const { label, img, contentHTML} = this.state;
    const {content, isNewContent, isNewVari, mode, variID} = this.props.data;
    const vari = isNewVari? {} : content.variations.filter(v => v.variationID === variID)[0];
    const tempVari = () => [{label: this.state.label,userID: UserStore.user.userID, contentRAW: this.state.contentRAW, contentHTML: this.state.contentHTML}];
    let updatedState = {};
    Object.keys(this.state)
      .filter(i => i[0] !=="_" && this.state[i].length)
      .forEach(i => updatedState[i] = this.state[i]);

    const idobject = mode === "announcement"? {announcementID:this.props.match.params.contentID,mode} : {policyID: this.props.match.params.contentID,mode};

    const data = 
    Object.assign(
    {
      label: updatedState.label? updatedState.label : isNewContent? "" : content.label,
      img: updatedState.img? updatedState.img : isNewContent? "" : content.img,
      variations: [{
        variationID: variID,
        userID: UserStore.user.userID,
        contentHTML: updatedState.contentHTML? updatedState.contentHTML : isNewVari? "" : vari.contentHTML,
        updated: Date.now()
      }]
    }, idobject);
    return data;
    // return Object.assign(content.label? content : {label: this.state.label, img: this.state.img}, {variations: !isNewVari? vari : tempVari()})

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
    const {mode, isNewContent, contentID, variID} = this.props.data;
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

  componentDidUpdate(){
    if (this.hasBeenChanged()) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
  }

  render() {

    const { TeamStore } = this.props;
    const {content, isNewContent, isNewVari, mode, variID} = this.props.data;
    const vari = isNewVari? {} : content.variations.filter(v => v.variationID === variID)
    const tempVari = () => [{label: this.state.label,userID: UserStore.user.userID, contentRAW: this.state.contentRAW, contentHTML: this.state.contentHTML}];
    const { _options, _errors, _exiting } = this.state;

    let attachedStyle = {paddingTop: 35, maxWidth: 450}
    if (isNewContent) attachedStyle.pointerEvents = "none";

    const attachFiles = isNewContent? <span style={{fontSize: "0.9em",fontWeight: '400', fontStyle: 'italic'}}>Want to attach a file? Please save as a draft first</span>
    :  <Segment disabled={isNewContent}>
    <AttachedFiles mode={mode}  />
  </Segment>

    const displayOptions = _options && 
      {
        "attach": attachFiles,
        "image": <FeaturedImage mode={mode} defaultImgUrl={this.state.img? this.state.img : content.img} imgData={content.imgData} output={val => this.setState({img: val.img, imgData: val.imgData? val.imgData: ""})} />,
        "channel": <Channel mode={mode} defaultChannel={content.chanID} output={val => this.setState({chanID: val})} />

      }[_options]

    return (
      <div>

         <Prompt
            when={this.hasBeenChanged()}
            message='You have unsaved changes, are you sure you want to leave?'
          />
        <ContentPreview
          open={this.state._contentPreview} onClose={()=>this.togglePreview(false)} 
          data={this.contentPreviewData()} 
        />
        <BackButton />
        <Header as="h2" style={{padding: 0, marginBottom: 10}}>
          {isNewContent ? "Creating" : "Editing"} {mode.charAt(0).toUpperCase() + mode.slice(1)} 
        </Header>
      
        <TextField
            error={_errors && _errors.includes("Title")}
            id="standard-full-width"
            label={`${!isNewContent? "Variation " : ""}Title`}
            placeholder="Enter a title for this content..."
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e=>this.setState({label: e.target.value})}
            defaultValue={isNewContent? "" : isNewVari || !vari[0].label?  content.label : vari[0].label}
            InputProps={{disableUnderline: true, style: {fontSize: "1.4em"} }}
            />

        <Wysiwyg  error={_errors && _errors.includes("Body")} loadContent={!isNewVari? vari[0].contentRAW: {}} border output={e=>this.updateDraft(e)}/>
        <div>
          {TeamStore._isTargetingAvail &&
          <Row>
            <Col>
             <div style={{ paddingTop: "10px" }}>
              <ChooseTargeting
                noPass
                NoSelectUsers 
                label={"share " + mode} 
                input= {isNewVari? false : {sendTargetType: vari[0].teamID === "global" && !vari[0].tags.length? "all": "teams", sendToTeamID: !this.state.teamID? vari[0].teamID : this.state.teamID, sendToTagID: this.state.tagID? this.state.tagID : !vari[0].tags.length? "": vari[0].tags[0]}}
                output={val=> this.setState(val.sendTargetType==="all"? {"teamID": "global", "tags": []}: val.sendToTeamID? {teamID:val.sendToTeamID}:{tags: !val.sendToTagID || val.sendToTagID==="none"? []:[val.sendToTagID]})}
                />
            </div>
            </Col>
          </Row>
          }
          <Row style={{padding: "10px 0 10px"}}>
            <Col>
            <PublishControls unsavedWarning={isNewContent} stage={isNewContent? "draft" : isNewVari? "draft" : vari[0].stage} onClick={val => this.changeStage(val)} />
            <CommonOptions isNewContent={isNewContent} unsavedWarning={isNewVari} handleClick={(e) => this.setState(e === "preview"? {_contentPreview: true} : {_options: e===_options? "": e})}/>
            </Col>
          </Row>
          <Row>
            <Col>
                {displayOptions}
            </Col>
          </Row>
          <br/>
        </div>
      </div>
    );
  }
}

export default withRouter(VariationContent);
