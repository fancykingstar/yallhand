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

import { FeaturedImage } from "../ManageContent/FeaturedImage";
import { Channel } from "../ManageContent/Channel";

import { createPolicy, createAnnouncement, modifyPolicy, modifyAnnouncement, createHistory } from "../../DataExchange/Up"
import { content, contentEdit, contentHistory } from "../../DataExchange/PayloadBuilder"

import toast from "../../YallToast"
import _ from "lodash";

@inject("DataEntryStore", "UIStore", "AnnouncementsStore", "PoliciesStore")
@observer
class VariationContent extends React.Component {
  constructor(props){
    super(props);
    this.state={};
    this.reset();
  }
  reset() {
    this.setState({   
      label: "",
      contentRAW: "",
      contentHTML: "",
      teamID: "",
      tagID: "",
      stage: "",
      img: "",
      imgData: "",
      chanID: "",
      resourceID: "",
      _options: "",
      _audience_target: "",})
  }

  hasBeenChanged() { return Boolean(Object.values(this.state).filter(i=>i).length) }
  

  changeStage(stage) {
    const { AnnouncementsStore, PoliciesStore, DataEntryStore, UIStore, history } = this.props;
    const {mode, isNewContent, contentID, variID} = this.props.data;

    this.setState({stage});

    const isPolicy = mode === "policy";
    const path = isPolicy ? `/panel/faqs/` : `/panel/announcements/`;
    const typeId = `${mode}ID`;
    
    if (isNewContent) {
      (isPolicy ? createPolicy(content(this.state)) : createAnnouncement(content(this.state))).then(res => {
        if (isPolicy) PoliciesStore.pushPolicies(res);
        else AnnouncementsStore.pushAnnouncements(res);
        const id = res[typeId];
        this.reset();
        // UIStore.set("content", typeId, id);
        history.push(`${path}${res[id]}`);
      });
    }
    else {

      console.log("modified", contentEdit(this.state, mode, contentID, variID));

      // if (isPolicy) modifyPolicy(contentEdit(this.state, mode, contentID, variID));
      // else modifyAnnouncement(contentEdit(this.state, mode, contentID, variID));
      // this.reset();
        // history.push(`${path}${UIStore.content[mode + "ID"]}`);
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
    const { DataEntryStore, UIStore } = this.props;
    const {content, isNewContent, isNewVari, mode} = this.props.data;
    const { _options } = this.state;

    let attachedStyle = {paddingTop: 35, maxWidth: 450}
    if (DataEntryStore.content.isNew) attachedStyle.pointerEvents = "none";

    const attachFiles = DataEntryStore.content.isNew? <span style={{fontSize: "0.9em",fontWeight: '400', fontStyle: 'italic'}}>Want to attach a file? Please save as a draft first</span>
    :  <Segment disabled={DataEntryStore.content.isNew}>
    <AttachedFiles mode={mode}  />
  </Segment>




    const displayOptions = _options && 
      {
        "attach": attachFiles,
        "image": <FeaturedImage mode={mode} defaultImgUrl={content.img} imgData={content.imgData} output={val => this.setState({img: val.img, imgData: val.imgData? val.imgData: ""})} />,
        "channel": <Channel mode={mode} defaultChannel={content.chanID} output={val => this.setState({chanID: val})} />

      }[_options]

    return (
      <div>
         <Prompt
            when={this.hasBeenChanged()}
            message='You have unsaved changes, are you sure you want to leave?'
          />
        <BackButton />
        <Header as="h2" style={{padding: 0, marginBottom: 10}}>
          {DataEntryStore.content.isNew ? "Creating" : "Editing"} {mode.charAt(0).toUpperCase() + mode.slice(1)} 
        </Header>

        <TextField
            id="standard-full-width"
            label="Title"
            placeholder="Enter a title for this content..."
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e=>this.setState({label: e.target.value})}
            defaultValue={isNewContent? "" : content.variations[0].label? content.variations[0].label : content.label }
            InputProps={{disableUnderline: true, style: {fontSize: "1.4em"} }}
            />

        <Wysiwyg loadContent={content.variations? content.variations[0].contentRAW: {}} border output={e=>this.setState({contentRAW: e.raw, contentHTML: e.html})}/>

        <div>
          <Row>
            <Col>
             <div style={{ paddingTop: "10px" }}>
              <ChooseTargeting 
                NoSelectUsers 
                label={mode} 
                echostate={val=> this.setState(val.sendTargetType==="all"? {"teamID": "global", "tagID": ""}:{"teamID": val.sendToTeamID, "tagID": val.sendToTagID})}
                />
            </div>
            </Col>
          </Row>
          <Row style={{padding: "10px 0 10px"}}>
            <Col>
            <PublishControls unsavedWarning={isNewContent} stage={isNewContent? "draft" : content.variations[0].stage} onClick={val => this.changeStage(val)} />
            <CommonOptions unsavedWarning={isNewVari} handleClick={(e) => this.setState({_options: e===_options? "": e})}/>
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
