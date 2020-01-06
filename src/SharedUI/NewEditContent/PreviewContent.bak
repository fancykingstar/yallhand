import React from "react";
import { inject, observer } from "mobx-react";
import { Segment, Button, Dropdown, Menu, Header } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

import { Wysiwyg } from "../../SharedUI/Wysiwyg";
import { ContentPreview } from "../../SharedUI/ContentPreview";

import { content, contentEdit, contentHistory } from "../../DataExchange/PayloadBuilder"

// import toast from "../../YallToast"
import _ from "lodash";
import { UserStore } from "../../Stores/UserStore";

@inject("DataEntryStore", "UIStore", "AnnouncementsStore", "PoliciesStore", "TeamStore")
@observer
class PreviewContent extends React.Component {
  constructor(props){
    super(props);
    this.state={
      label: "",
      contentHTML: "",
      img: "",
      imgData: "",
      _contentPreview: false,
    };
  }
  reset() {
    this.setState({
      label: "",
      contentHTML: "",
      img: "",
      imgData: "",
      _contentPreview: false,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      let { DataEntryStore } = nextProps;
      if (nextProps.data.label == "")
        this.setState({label: DataEntryStore.contentmgmt.label, img: DataEntryStore.contentmgmt.prevImg ? DataEntryStore.contentmgmt.prevImg : DataEntryStore.contentmgmt.img, contentHTML: nextProps.data.contentHTML});
      else
        this.setState({label: nextProps.data.label, img: DataEntryStore.contentmgmt.prevImg ? DataEntryStore.contentmgmt.prevImg : DataEntryStore.contentmgmt.img, contentHTML: nextProps.data.contentHTML});
    }
  }

  togglePreview = (bool) => {this.setState({_contentPreview: bool})};
  
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

  render() {
    return (
      <>
        { 
          this.props.data.loaded && 
          <ContentPreview 
            open={this.props.data._contentPreview} onClose={(e) => this.props.togglePreview()} 
            data={this.contentPreviewData()} 
          />
        }
      </>
    );
  }
}

export default withRouter(PreviewContent);
