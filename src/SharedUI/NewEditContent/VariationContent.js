import React from "react";
import { inject, observer } from "mobx-react";
import { Prompt } from 'react-router'
import { Segment, Button, Dropdown, Menu, Header } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import { Row, Col, } from 'reactstrap';

import { useBeforeunload } from 'react-beforeunload';

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

import toast from "../../YallToast"
import _ from "lodash";

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
      _audience_target: "",})
  }
  
  componentDidMount(){
    this.reset();
  }

  updateDraft = (e) => this.setState({contentRAW: e.raw, contentHTML: e.html});

  togglePreview = (bool) => this.setState({_contentPreview: bool});

  hasBeenChanged() { 
    return Boolean(Object.values(this.state).filter(i=>i.length).length); 
  }
  

  async changeStage(stage) {
    const { AnnouncementsStore, PoliciesStore, UIStore, history } = this.props;
    const {mode, isNewContent, contentID, variID} = this.props.data;
    if ((!this.state.label || !this.state.contentHTML) && !variID) {
      toast.error("Whoops, please be sure to have a title and content before saving", {hideProgressBar: true})
      return;
    }

    await this.setState({stage});

    const isPolicy = mode === "policy";
    const path = isPolicy ? `/panel/faqs/` : `/panel/announcements/`;
    const typeId = `${mode}ID`;
    
    if (isNewContent) {
      const res = isPolicy?  await createPolicy(content(this.state)) : await createAnnouncement(content(this.state));
      const id = res[typeId];
      await this.reset();
      await history.push(`${path}${res[id]}`)
    }
    else {
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
    const { _options } = this.state;

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
        {JSON.stringify(this.state)}
         <Prompt
            when={this.hasBeenChanged()}
            message='You have unsaved changes, are you sure you want to leave?'
          />
        <ContentPreview open={this.state._contentPreview} onClose={()=>this.togglePreview(false)} data={{mode: "policy", contentID: "", PostData  : Object.assign(content, {variations: vari})}} />
        <BackButton />
        <Header as="h2" style={{padding: 0, marginBottom: 10}}>
          {isNewContent ? "Creating" : "Editing"} {mode.charAt(0).toUpperCase() + mode.slice(1)} 
        </Header>

        <TextField
            error={Boolean(this.state.contentHTML && !this.state.label && !content.label)}
            id="standard-full-width"
            label="Title"
            placeholder="Enter a title for this content..."
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e=>this.setState({label: e.target.value})}
            defaultValue={isNewContent? "" : vari[0].label? vari[0].label : content.label }
            InputProps={{disableUnderline: true, style: {fontSize: "1.4em"} }}
            />

        <Wysiwyg loadContent={content.variations.length? vari[0].contentRAW: {}} border output={e=>this.updateDraft(e)}/>
        <div>
          {TeamStore._isTargetingAvail &&
          <Row>
            <Col>
             <div style={{ paddingTop: "10px" }}>
              <ChooseTargeting
                noPass
                NoSelectUsers 
                label={mode} 
                input= {isNewVari? false : {sendTargetType: vari[0].teamID === "global" && !vari[0].tags.length? "all": "teams", sendToTeamID: !this.state.teamID? vari[0].teamID : this.state.teamID, sendToTagID: this.state.tagID? this.state.tagID : !vari[0].tags.length? "": vari[0].tags[0]}}
                output={val=> this.setState(val.sendTargetType==="all"? {"teamID": "global", "tags": []}: val.sendToTeamID? {teamID:val.sendToTeamID}:{tags: val.sendToTagID==="none"? []:[val.sendToTagID]})}
                />
            </div>
            </Col>
          </Row>
          }
          <Row style={{padding: "10px 0 10px"}}>
            <Col>
            <PublishControls unsavedWarning={isNewContent} stage={isNewContent? "draft" : vari[0].stage} onClick={val => this.changeStage(val)} />
            <CommonOptions unsavedWarning={isNewVari} handleClick={(e) => this.setState(e === "preview"? {_contentPreview: true} : {_options: e===_options? "": e})}/>
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
