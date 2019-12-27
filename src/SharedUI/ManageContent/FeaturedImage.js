import React from "react";
import { inject, observer } from "mobx-react";
import { Segment, Form, Header, Message, Modal, Button } from "semantic-ui-react";
import { S3Upload } from "../../DataExchange/S3Upload";
import { GenerateFileName } from "../../SharedCalculations/GenerateFileName";
import { modifyAnnouncement, modifyPolicy } from "../../DataExchange/Up";
import { featuredImgEdit } from "../../DataExchange/PayloadBuilder";
import { Row, Col, } from 'reactstrap';
import _ from "lodash";
import "./style.css";
import { apiCall } from "../../DataExchange/Fetch";
import toast  from "../../YallToast"
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';

@inject("DataEntryStore", "AccountStore", "UIStore")
@observer
export class FeaturedImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: "", retrievedImg: "", loading: false, success: false };
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
       {
        if(res.errors) {
          toast.error(res.errors[0], {hideProgressBar: true})
          this.setState({ loading: false } )
        } 
        else this.setState({ retrievedImg: res, loading: false } )
       }

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

  handleUpdate = e => {
    const { DataEntryStore, AccountStore } = this.props;
    this.setState({ updated: true });
    e.preventDefault();
    if (DataEntryStore.featuredImage.splash) {
      this.requestDownload().then(() => {
        DataEntryStore.set("contentmgmt", "img", this.state.retrievedImg.urls.regular);
        DataEntryStore.set("featuredImage", "splash", false);
      }).then(() => {
        if (this.props.mode) this.props.mode === "policy"
              ? modifyPolicy(featuredImgEdit("policy"))
              : modifyAnnouncement(featuredImgEdit("announcement"));
      }).then(() => {
        DataEntryStore.reset("featuredImage");          
      });
    }
    else {
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
            this.setState({url: result.file.location});
            if(this.props.output) this.props.output({img: result.file.location})
            else DataEntryStore.set("contentmgmt", "img", result.file.location) 
            DataEntryStore.set("contentmgmt", "imgData", {});
          }
        })
        .then(() => {
          if (this.props.mode && !this.props.output)
            this.props.mode === "policy"
              ? modifyPolicy(featuredImgEdit("policy"))
              : modifyAnnouncement(featuredImgEdit("announcement"));
        })
        .then(() => {DataEntryStore.reset("featuredImage");});
      }
  }

  handleRemove = e => {
    const { DataEntryStore, AccountStore } = this.props;
    DataEntryStore.set("contentmgmt", "imgData", {});
    DataEntryStore.set("contentmgmt", "img", "");
    this.setState({ updated: false })
    e.preventDefault();
    if (DataEntryStore.featuredImage.splash) {
      this.requestDownload().then(() => {
        DataEntryStore.set("contentmgmt", "img", this.state.retrievedImg.urls.regular);
        DataEntryStore.set("featuredImage", "splash", false);
      }).then(() => {
        if (this.props.mode) this.props.mode === "policy"
              ? modifyPolicy(featuredImgEdit("policy"))
              : modifyAnnouncement(featuredImgEdit("announcement"));
      }).then(() => {
        DataEntryStore.reset("featuredImage");          
      });
    }
    else {
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
            this.setState({url: false});
            if(this.props.output) this.props.output({img: result.file.location})
            else DataEntryStore.set("contentmgmt", "img", "") 
            DataEntryStore.set("contentmgmt", "imgData", {});
          }
        })
        .then(() => {
          if (this.props.mode && !this.props.output)
            this.props.mode === "policy"
              ? modifyPolicy(featuredImgEdit("policy"))
              : modifyAnnouncement(featuredImgEdit("announcement"));
        })
        .then(() => {DataEntryStore.reset("featuredImage");});
      }
  }

  requestDownload = async () => {
    await apiCall('/fileresources/unsplash/reqdownload', 'POST', {url:this.state.retrievedImg.links.download_location});
  }

  render() {
    const { AccountStore, DataEntryStore, UIStore } = this.props;
    let imagePreview = this.state.url ? 
      <div style={{ position: 'relative' }}>
        <img alt="featured visual" src={this.state.url} />
        { this.state.updated ? <IconButton aria-label="close" style={{ position: 'absolute', top: "-8px", right: "-8px", color: 'white' }} onClick={(e) => this.handleRemove(e)}>
          <CancelIcon color='white' />
          </IconButton> : ""
        }
      </div> : this.props.defaultImgUrl ? (
      <div style={{ position: 'relative' }}>
        <img alt="featured visual" src={this.props.defaultImgUrl} />
        <IconButton aria-label="close" style={{ position: 'absolute', top: "-8px", right: "-8px", color: 'white' }} onClick={(e) => this.handleRemove(e)}>
          <CancelIcon color='white' />
        </IconButton>
      </div>
    ) : (
      <div />
    );
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
            this.setState({url: result.file.location});
            DataEntryStore.set("contentmgmt", "prevImg", result.file.location);
            DataEntryStore.set("contentmgmt", "imgData", {});
          }
        })
    };

    const setUnsplash = async () => {
      await this.requestDownload();
      this.setState({url: this.state.retrievedImg.urls.regular});
      if(this.props.output) this.props.output({img: this.state.retrievedImg.urls.regular, imgData: this.state.retrievedImg})
      else {
        DataEntryStore.set("contentmgmt", "prevImg", this.state.retrievedImg.urls.regular);
        DataEntryStore.set("contentmgmt", "imgData", this.state.retrievedImg);
        DataEntryStore.set("featuredImage", "splash", true);
      }
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
              style={{ overflow: "hidden" }}
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
        {preview}
        <br/>
        <Form>
          <Form.Group style={{ flexWrap:  "wrap"}}>
            <Form.Input
              size="mini"
              id="fileDisplayArea"
              type="file"
              onChange={e => {handleImageChange(e)}}
              style={{ marginBottom: 20 }}
            />
            <Form.Button
              primary
              disabled={
                DataEntryStore.featuredImage.file === "" ||
                UIStore.message.featuredImage !== ""
              }
              onClick={e => handleSubmit(e)}
              style={{ marginBottom: 20 }}
            >
              Upload
            </Form.Button>
            <Form.Button
              onClick={e => UIStore.set("modal", "getUnsplash", true)}
              style={{ marginBottom: 20 }}
            >
              Stock...
            </Form.Button>
            { !DataEntryStore.contentmgmt.hide ? 
              <Form.Button
                onClick={e => this.handleUpdate(e)}
                style={{ marginBottom: 20 }}
                disabled={ this.state.url ? false: true }
              >
                Submit
              </Form.Button> : ""
            }
          </Form.Group>
        </Form>
  
        <Message hidden={UIStore.message.featuredImage === ""} error>
          {UIStore.message.featuredImage}
        </Message>
      </Segment>
    );
  }
}
