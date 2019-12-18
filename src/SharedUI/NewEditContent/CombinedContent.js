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
import PreviewContent from "./PreviewContent";

// import toast from "../../YallToast"
import _ from "lodash";
import { UserStore } from "../../Stores/UserStore";
import { EditorState, convertToRaw, convertFromRaw, RichUtils, Modifier } from "draft-js";
import draftToHtml from "draftjs-to-html";

@inject("DataEntryStore", "UIStore", "AnnouncementsStore", "PoliciesStore", "TeamStore")
@observer
class CombinedContent extends React.Component {
  constructor(props){
    super(props);
    this.state={
      label: "",
      contentRAW: {},
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
    };
  }
  reset() {
    this.setState({   
      label: "",
      contentRAW: {},
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


  hasBeenChanged() {
    const state = {
      label : this.state.label,
      contentRAW : this.state.contentRAW,
      contentHTML : this.state.contentHTML,
      teamID : this.state.teamID,
      tags : this.state.tags,
      stage : this.state.stage,
      img : this.state.img,
      imgData : this.state.imgData,
      chanID : this.state.chanID,
      resourceID : this.state.resourceID,
      _options : this.state._options,
      _errors : this.state._errors,
      _contentPreview : this.state._contentPreview,
      _audience_target : this.state._audience_target,
    }
    return Boolean(Object.values(state).filter(i=>i.length).length); 
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState(nextProps.data);
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
      UIStore.set("content", "shouldBlockNavigation", false);
      await history.push(`${path}`)
    }


    else {
      contentEdit(this.state, mode, contentID, variID)
      if (isPolicy) await modifyPolicy(contentEdit(this.state, mode, contentID, variID));
      else await modifyAnnouncement(contentEdit(this.state, mode, contentID, variID));
      await this.reset();
      UIStore.set("content", "shouldBlockNavigation", false);
      await history.push(`${path}`);
    }

  }

  clickPreview = () => {
    this.setState(this.props.data);
    this.setState({_contentPreview: true})
  }

  render() {
    const { TeamStore } = this.props;
    const {content, isNewContent, isNewVari, mode, variID} = this.props.data;
    const vari = isNewVari? {} : content.variations.filter(v => v.variationID === variID)
    const tempVari = () => [{label: this.state.label,userID: UserStore.user.userID, contentRAW: this.state.contentRAW, contentHTML: this.state.contentHTML}];
    const { _options, _errors, _exiting } = this.state;

    let attachedStyle = {paddingTop: 35, maxWidth: 450}
    if (isNewContent) attachedStyle.pointerEvents = "none";

    const attachFiles = isNewContent ? <span style={{fontSize: "0.9em",fontWeight: '400', fontStyle: 'italic'}}>Want to attach a file? Please save as a draft first</span>
    :  <Segment disabled={isNewContent}>
    <AttachedFiles mode={mode}  />
  </Segment>


    const displayOptions = _options && 
      {
        "attach": attachFiles,
        "image": <FeaturedImage mode={mode} defaultImgUrl={this.state.img? this.state.img : content.img} imgData={content.imgData} output={val => this.setState({img: val.img, imgData: val.imgData? val.imgData: ""})} />,
        "channel": <Channel mode={mode} defaultChannel={content.chanID} output={val => this.setState({chanID: val})} />

      }[_options]

    const {loaded} = this.props.data;
    console.log(isNewVari);
    return (
      <div>
        <Prompt
          when={this.hasBeenChanged()}
          message='You have unsaved changes, are you sure you want to leave?'
        />
        {loaded && <PreviewContent data={this.state} togglePreview={() => this.setState({_contentPreview: false})}/>}
        <Wysiwyg  error={_errors && _errors.includes("Body")} isNewVari={isNewVari} loadContent={!isNewVari ? vari[0].contentRAW : {}} border output={e=>this.updateDraft(e)}/>
        <div>
            <Row style={{padding: "10px 0 10px 15px"}}>
                <PublishControls unsavedWarning={isNewContent} stage={isNewContent? "draft" : isNewVari? "draft" : vari[0].stage} onClick={val => this.changeStage(val)} />
              <Button onClick={this.clickPreview}>Preview</Button>
            </Row>
            <br/>
        </div>
      </div>
    );
  }
}

export default withRouter(CombinedContent);
