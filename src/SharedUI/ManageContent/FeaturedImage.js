import React from "react";
import { inject, observer } from "mobx-react";
import { Segment, Form, Header, Message, Modal, Button } from "semantic-ui-react";
import { S3Upload } from "../../DataExchange/S3Upload";
import { GenerateFileName } from "../../SharedCalculations/GenerateFileName";
import { modifyAnnouncement, modifyPolicy } from "../../DataExchange/Up";
import { featuredImgEdit } from "../../DataExchange/PayloadBuilder";
import _ from "lodash";
import "./style.css";
import { apiCall } from "../../DataExchange/Fetch";

@inject("DataEntryStore", "AccountStore", "UIStore")
@observer
export class FeaturedImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: "", retrievedImg: "", loading: false };
    this.buildUrl = (url, parameters) => {
      let qs = "";
      for (const key in parameters) {
          if (parameters.hasOwnProperty(key)) {
              const value = parameters[key];
              qs +=
                  encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
          }
      }
      if (qs.length > 0) {
          qs = qs.substring(0, qs.length - 1); //chop off last "&"
          url = url + "?" + qs;
      }
  
      return url;
  }

    this.getImg = async () => {
      this.setState({ loading: true });
      await apiCall('/fileresources/unsplash/random', 'POST', {query:this.state.input}).then(res => res.json()).then(res =>
        this.setState({ retrievedImg: res, loading: false } )

        ) };
  }
  componentWillUnmount() {
    const { DataEntryStore } = this.props;
    DataEntryStore.reset("featuredImage");
  }
  componentWillMount() {
    const { UIStore } = this.props;
    UIStore.set("message", "featuredImage", "");
  }
  render() {
    const { AccountStore, DataEntryStore, UIStore } = this.props;
    let imagePreview = this.props.defaultImgUrl ? (
      <img alt="featured visual" src={this.props.defaultImgUrl} />
    ) : (
      <div />
    );
    const requestDownload = async () => {
      await apiCall('/fileresources/unsplash/reqdownload', 'POST', {url:this.state.retrievedImg.links.download_location});
    }
    const handleSubmit = e => {
      e.preventDefault();
      S3Upload(
        "public-read",
        "central",
        GenerateFileName(
          AccountStore.account,
          DataEntryStore.featuredImage.filename
        ),
        DataEntryStore.featuredImage.file
      )
        .then(result => {
          if (result !== null) { 
            DataEntryStore.set("contentmgmt", "img", result.file.location) 
          }
        })
        .then(() => {
          if (this.props.mode)
            this.props.mode === "policy"
              ? modifyPolicy(featuredImgEdit("policy"))
              : modifyAnnouncement(featuredImgEdit("announcement"));
        })
        .then(() => DataEntryStore.reset("featuredImage"));
    };

    const setUnsplash = async () => {
      await requestDownload();
      DataEntryStore.set("contentmgmt", "img", this.state.retrievedImg.urls.regular);
      DataEntryStore.set("contentmgmt", "imgData", this.state.retrievedImg);
      if (this.props.mode) await this.props.mode === "policy"
              ? modifyPolicy(featuredImgEdit("policy"))
              : modifyAnnouncement(featuredImgEdit("announcement"));
      DataEntryStore.reset("featuredImage");
      UIStore.set("modal", "getUnsplash", false)
    }

    const handleImageChange = e => {
      e.preventDefault();
      const maxWidth = this.props.maxWidth;
      let file = e.target.files[0];
      let fileType = /image.*/;
      if (!file.type.match(fileType)) {
        DataEntryStore.set("featuredImage", "file", "");
        DataEntryStore.set("featuredImage", "url", "");
        alert("File type not supported");
      } else {
        let reader = new FileReader();
        reader.onload = e => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = function() {
            const h = this.width;
            const w = this.height;
            if (maxWidth === undefined) {
              DataEntryStore.set("featuredImage", "file", file);
              DataEntryStore.set("featuredImage", "url", reader.result);
              DataEntryStore.set("featuredImage", "filename", file.name);
              UIStore.set("message", "featuredImage", "");
            } else {
              if (w >= maxWidth) {
                DataEntryStore.set("featuredImage", "file", file);
                DataEntryStore.set("featuredImage", "url", reader.result);
                DataEntryStore.set("featuredImage", "filename", file.name);
                UIStore.set("message", "featuredImage", "");
              } else {
                UIStore.set(
                  "message",
                  "featuredImage",
                  `Sorry, this image needs to be at least ${maxWidth} px wide`
                );
              }
            }
          };
        };
        reader.readAsDataURL(file);
      }
    };

    const preview =
      this.props.circular !== undefined ? (
        <div className="Avatar-Wrap">

          {" "}
          <img className="Avatar" size="small" src={this.props.defaultImgUrl} />
        </div>
      ) : (
        <React.Fragment> <div className="imgPreview">{imagePreview} </div> {_.isEmpty(this.props.imgData)?"": <div style={{maxWidth: '100px'}}><p style={{fontSize: "0.7em"}}>Photo by <a target="_blank" href={`https://unsplash.com/@${this.props.imgData.user.username}?utm_source=yallhands&utm_medium=referral`}>{this.props.imgData.user.name}</a> on <a target="_blank" href="https://unsplash.com/?utm_source=yallhands&utm_medium=referral">Unsplash</a></p></div>} </React.Fragment>
      );

    return (
      <Segment>
        <Modal open={UIStore.modal.getUnsplash} closeIcon onClose={e => UIStore.set("modal", "getUnsplash", false)}>
          <Modal.Content>
            <Form onSubmit={e => this.getImg()}>
              <Form.Group inline>
                <Form.Input
                  value={this.state.input}
                  onChange={(e, val) => this.setState({ input: val.value })}
                  label="Search by keyword"
                  action="Get Image"
                  loading={this.state.loading}
                  placeholder="Enter term(s)..."
                />
              {!this.state.retrievedImg? "":   <Button onClick={()=>setUnsplash()} primary>Use Image</Button>}
              </Form.Group>
            </Form>
           <div style={{width: '100%', textAlign: 'center'}}>
             <div>
               {!this.state.retrievedImg? "":          <h4>Photo by <a target="_blank" href={`https://unsplash.com/@${this.state.retrievedImg.user.username}?utm_source=yallhands&utm_medium=referral`}>{this.state.retrievedImg.user.name}</a> on <a target="_blank" href="https://unsplash.com/?utm_source=yallhands&utm_medium=referral">Unsplash</a></h4>}
             <img
              style={{ maxWidth: 800, overflow: "hidden" }}
              src={this.state.retrievedImg? this.state.retrievedImg.urls.regular: ""}
            />
             </div>
         
           </div>
          </Modal.Content>
        </Modal>
        <Header>
          {this.props.label === undefined ? "Featured Image" : this.props.label}
        </Header>
        <br />
        <Form>
          <Form.Group>
            <Form.Input
              size="mini"
              id="fileDisplayArea"
              type="file"
              onChange={e => handleImageChange(e)}
            />
            <Form.Button
              primary
              disabled={
                DataEntryStore.featuredImage.file === "" ||
                UIStore.message.featuredImage !== ""
              }
              onClick={e => handleSubmit(e)}
            >
              Upload Image
            </Form.Button>
            <Form.Button
              onClick={e => UIStore.set("modal", "getUnsplash", true)}
            >
              Search Unsplash...
            </Form.Button>
          </Form.Group>
        </Form>
        {preview}
        <Message hidden={UIStore.message.featuredImage === ""} error>
          {UIStore.message.featuredImage}
        </Message>
      </Segment>
    );
  }
}
