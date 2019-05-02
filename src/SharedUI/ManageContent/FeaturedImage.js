import React from "react";
import { inject, observer } from "mobx-react";
import { Segment, Form, Header, Message } from "semantic-ui-react";
import {S3Upload} from "../../DataExchange/S3Upload"
import {GenerateFileName} from "../../SharedCalculations/GenerateFileName"
import {modifyAnnouncement, modifyPolicy} from "../../DataExchange/Up"
import {featuredImgEdit} from "../../DataExchange/PayloadBuilder"
import "./style.css";

 
@inject("DataEntryStore", "AccountStore", "UIStore")
@observer
export class FeaturedImage extends React.Component {
  componentWillMount(){
  const {UIStore} = this.props
  UIStore.set("message", "featuredImage", "")
  }
  render() {
    const { AccountStore, DataEntryStore, UIStore } = this.props
    let imagePreview = this.props.defaultImgUrl ? (
      <img alt="featured visual" src={this.props.defaultImgUrl} />
    ) : (
      <div />
    );
    const handleSubmit = (e) => {
      e.preventDefault();
      S3Upload("public-read", "quadrance-files/central", GenerateFileName(AccountStore.account, DataEntryStore.featuredImage.filename), DataEntryStore.featuredImage.file)
      .then(result =>
        {
            if(result !== null){
              this.props.mode === "policy"?  DataEntryStore.set("contentmgmt", "img", result.Location) 
              : DataEntryStore.set("contentmgmt", "img", result.Location)
            }
        }
      ).then(()=> {
        if(this.props.mode) this.props.mode === "policy"? modifyPolicy(featuredImgEdit("policy")) : modifyAnnouncement(featuredImgEdit("announcement"))
      })
    };


    const handleImageChange = e => {
      e.preventDefault();
      const maxWidth = this.props.maxWidth
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
          img.onload = function () {
             const h = this.width;
             const w = this.height;
          if(maxWidth === undefined){
            DataEntryStore.set("featuredImage", "file", file);
            DataEntryStore.set("featuredImage", "url", reader.result);
            DataEntryStore.set("featuredImage", "filename", file.name)
            UIStore.set("message", "featuredImage", "")
          }
          else{
            if(w >= maxWidth){
              DataEntryStore.set("featuredImage", "file", file);
              DataEntryStore.set("featuredImage", "url", reader.result);
              DataEntryStore.set("featuredImage", "filename", file.name)
              UIStore.set("message", "featuredImage", "")
            }
            else{
              UIStore.set("message", "featuredImage", `Sorry, this image needs to be at least ${maxWidth} px wide`)

            }
          }   
          }}
        reader.readAsDataURL(file);
      }
    };

    const preview = this.props.circular !== undefined ?<div className="Avatar-Wrap"> <img className="Avatar" size="small" src={this.props.defaultImgUrl} /></div>  :  <div className="imgPreview">{imagePreview}</div>

    return (
      <Segment>
        <Header>{this.props.label === undefined ? "Featured Image" : this.props.label}</Header>
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
              disabled={DataEntryStore.featuredImage.file === "" || UIStore.message.featuredImage !== ""}
              onClick={e => handleSubmit(e)}
            >
              Upload Image
            </Form.Button>
          </Form.Group>
        </Form>
        {/* <Button onClick={e => handleDownload(e)}> 
              Get Image
          </Button> */}
       {preview}
      <Message hidden={UIStore.message.featuredImage === ""} error>{UIStore.message.featuredImage}</Message>
      </Segment>
    );
  }
}
