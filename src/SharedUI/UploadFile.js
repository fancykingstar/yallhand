import React from "react";
import { inject, observer } from "mobx-react";
import { Modal, Form, Header, Message, Dimmer, Loader } from "semantic-ui-react";
import { GenerateFileName } from "../SharedCalculations/GenerateFileName";
import { S3Upload } from "../DataExchange/S3Upload";
import { FormCharMax } from "../SharedValidations/FormCharMax";
import { UploadConfig } from "../SharedUI/UploadConfig";
import { fileResource, fileResourceEdit } from "../DataExchange/PayloadBuilder"
import {modifyFile} from "../DataExchange/Up";

@inject("UIStore", "DataEntryStore", "AccountStore")
@observer
export class UploadFile extends React.Component {
  constructor(props){
    super(props);
    this.state={loading: false};
  }
  render() {
    const { UIStore, DataEntryStore, AccountStore } = this.props;
    const newLabelStatus = FormCharMax(DataEntryStore.fileForUpload.label, 48);
    const handleSubmit = async (type) => {
      this.setState({loading: true});
      if(type === "update" && DataEntryStore.fileForUpload.file === ""){
        await await modifyFile(fileResourceEdit());
        UIStore.set("modal", "uploadFile", false);
        this.props.output("");
        
      }else{
        await S3Upload("authenticated-read", "gramercy", GenerateFileName(AccountStore.account, DataEntryStore.fileForUpload.filename), DataEntryStore.fileForUpload.file, this.props.assoc? fileResource(this.props.assoc): fileResource())
        .then((r) => {
          UIStore.set("modal", "uploadFile", false);
          this.props.output(r);
        })
      }
      this.setState({loading: false});
    };

    const handleFileChange = e => {
      e.preventDefault();
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onloadend = () => {
        DataEntryStore.set("fileForUpload", "file", file);
        DataEntryStore.set("fileForUpload", "url", reader.result);
        DataEntryStore.set("fileForUpload", "filename", file.name);
      };
      reader.readAsDataURL(file);
    };

    const title =
      this.props.title === undefined
        ? `Upload a new file to associate with this ${
            this.props.mode
          } variation`
        : this.props.title;

    const CreateOrUpdate = !DataEntryStore.fileForUpload.isNew ? (
        <Form.Button
          onClick={e => handleSubmit("update")}
          primary
        >
          Update
        </Form.Button>
      ) : (
        <Form.Button
          disabled={
            DataEntryStore.fileForUpload.label === "" ||
            DataEntryStore.fileForUpload.file === ""
          }
          onClick={e => handleSubmit("create")}
          primary
        >
          Create
        </Form.Button>
      );
      const useConfig = UIStore.modal.uploadAssocEdit ? <UploadConfig mode={"file"} /> : null;

    return (
      <React.Fragment>
        <Modal
          closeIcon
          open={this.props.open}
          // trigger={<Button size="medium" primary><Icon name='upload'/>Upload New</Button>}
          // onClick={UIStore.set("modal", "uploadFile", true)}
          onClose={e => UIStore.set("modal", "uploadFile", false)}
        >
          <Dimmer inverted active={this.state.loading}>
          <Loader inverted>Uploading...</Loader>
          </Dimmer>
          <Modal.Header>{title}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Header>{this.props.objLabel}</Header>
              <Form>
                <Form.Group>
                  <Form.Input
                    value={DataEntryStore.fileForUpload.label}
                    label="Descriptive Title (required):"
                    style={{ minWidth: 350 }}
                    onChange={(e, val) =>
                      DataEntryStore.set("fileForUpload", "label", val.value)
                    }
                  >
                    <input maxLength="48" />
                  </Form.Input>
                  {/* {includeTeamTag} */}
                </Form.Group>

                {!DataEntryStore.fileForUpload.isNew? "":  
                <Form.Input
                  label={!DataEntryStore.fileForUpload.isNew ? "Replace File (optional)" : "Add File (required)"}
                  size="mini"
                  id="fileDisplayArea"
                  type="file"
                  style={{ maxWidth: 350 }}
                  onChange={e => handleFileChange(e)}
                />}
                {useConfig}

                <Form.Group>
                  {CreateOrUpdate}
                  {/* <Form.Button
                  type="submit"
                  disabled={
                    DataEntryStore.fileForUpload.label === "" ||
                    DataEntryStore.fileForUpload.file === ""
                  }
                  primary
                >
                  Upload
                </Form.Button> */}
                  <Form.Button
                    onClick={e => UIStore.set("modal", "uploadFile", false)}
                  >
                    Cancel
                  </Form.Button>
                </Form.Group>
              </Form>
              <Message error attached hidden={newLabelStatus.messageHide}>
                {newLabelStatus.message}
              </Message>
              <p style={{ fontSize: ".8em" }}>
                <span role="img" aria-labelledby="jsx-a11y/accessible-emoji">💡 </span>Uploaded files get encrypted and are only accessable via
                Yallhands to admins and to the designated audiences of
                associated variations
              </p>
            </Modal.Description>
          </Modal.Content>
 
        </Modal>
      </React.Fragment>
    );
  }
}
