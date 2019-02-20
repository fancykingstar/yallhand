import React from "react";
import { inject, observer } from "mobx-react";
import { Segment, Image, Form, Header } from "semantic-ui-react";
import {S3Upload} from "../../DataExchange/S3Upload"
import {GenerateFileName} from "../../SharedCalculations/GenerateFileName"
import {modifyAnnouncement, modifyPolicy} from "../../DataExchange/Up"
import {featuredImgEdit} from "../../DataExchange/PayloadBuilder"
import "./style.css";

@inject("DataEntryStore", "AccountStore")
@observer
export class FeaturedAvatar extends React.Component {
  render() {
    const { AccountStore } = this.props
    const { DataEntryStore } = this.props;
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
                this.props.uploaded(result.Location)
            }
        }
      )
    };


    const handleImageChange = e => {
      e.preventDefault();
      let file = e.target.files[0];
      let fileType = /image.*/;
      if (!file.type.match(fileType)) {
        DataEntryStore.set("featuredImage", "file", "");
        DataEntryStore.set("featuredImage", "url", "");
        alert("File type not supported");
      } else {
        let reader = new FileReader();
        reader.onloadend = () => {
          DataEntryStore.set("featuredImage", "file", file);
          DataEntryStore.set("featuredImage", "url", reader.result);
          DataEntryStore.set("featuredImage", "filename", file.name)
        };
        reader.readAsDataURL(file);
      }
    };

    const preview = this.props.circular !== undefined ?<div className="Avatar-Wrap"> <Image className="Avatar" size="small" src={this.props.defaultImgUrl} /></div>  :  <div className="imgPreview">{imagePreview}</div>

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
              disabled={DataEntryStore.featuredImage.file === ""}
              onClick={e => handleSubmit(e)}
            >
              Upload Image
            </Form.Button>
          </Form.Group>
        </Form>
  
       {preview}
     
      </Segment>
    );
  }
}
