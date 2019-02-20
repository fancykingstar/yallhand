import React from "react";
import { inject, observer } from "mobx-react";
import { Modal, Form, Header, Message, 
  // Dropdown, Input 
} from "semantic-ui-react";
import { GenerateFileName } from "../SharedCalculations/GenerateFileName";
import { S3Upload } from "../DataExchange/S3Upload";
import { FormCharMax } from "../SharedValidations/FormCharMax";
import { UploadConfig } from "../SharedUI/UploadConfig";

@inject("UIStore", "DataEntryStore", "AccountStore")
@observer
export class UploadFile extends React.Component {
  render() {
    const { UIStore, DataEntryStore, AccountStore } = this.props;
    const newLabelStatus = FormCharMax(DataEntryStore.fileForUpload.label, 48);
    const handleSubmit = (type) => {
      if(type === "update" && DataEntryStore.fileForUpload.file === ""){
        UIStore.set("modal", "uploadFile", false);
        this.props.output(type);
      }else{
        S3Upload("authenticated-read", "quadrance-files/gramercy", GenerateFileName(AccountStore.account, DataEntryStore.fileForUpload.filename), DataEntryStore.fileForUpload.file)
        .then(result =>
          {
              if(result !== null){
                DataEntryStore.set("fileForUpload", "url", result.Location)
                DataEntryStore.set("fileForUpload", "S3Key", result.Key)
                console.log(result)
                // console.log(result)
                   //if sucess, add/update to file DB record
                  //if success, patch policy
                //   this.props.updateStore("img", result.Location)
              }
          }
        ).then(() => {
          UIStore.set("modal", "uploadFile", false);
          this.props.output(type);
        })
      }
      

      // DataEntryStore.reset("fileForUpload", {
      //   teamID: "global",
      //   tagID: "none"
      // });
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

    
    // const includeTeamTag =
    //   this.props.includeTeamTag !== undefined &&
    //   this.props.includeTeamTag === true ? (
    //     <React.Fragment>
    //       <TeamSelect
    //         label={"Limit Access To Teams"}
    //         placeholder="choose team..."
    //         value={DataEntryStore.fileForUpload.teamID}
    //         outputVal={val =>
    //           DataEntryStore.set("fileForUpload", "teamID", val)
    //         }
    //       />
    //       <TagSelect
    //         label={"Limit Access By Tag"}
    //         placeholder="choose tag..."
    //         value={DataEntryStore.fileForUpload.tagID}
    //         outputVal={val => DataEntryStore.set("fileForUpload", "tagID", val)}
    //       />
    //     </React.Fragment>
    //   ) : null;
    const title =
      this.props.title === undefined
        ? `Upload a new file to associate with this ${
            this.props.mode
          } variation`
        : this.props.title;
    const CreateOrUpdate = !DataEntryStore.fileForUpload.isNew ? (
        <Form.Button
          // type="submit"
          // disabled={
          //   DataEntryStore.fileForUpload.label === "" ||
          //   DataEntryStore.fileForUpload.file === ""
          // }
          onClick={e => handleSubmit("update")}
          primary
        >
          Update
        </Form.Button>
      ) : (
        <Form.Button
          // type="submit"
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

                <Form.Input
                  label={!DataEntryStore.fileForUpload.isNew ? "Replace File (optional)" : "Add File (required)"}
                  size="mini"
                  id="fileDisplayArea"
                  type="file"
                  style={{ maxWidth: 350 }}
                  onChange={e => handleFileChange(e)}
                />
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
                Quadrance to admins and to the designated audiences of
                associated variations
              </p>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    );
  }
}
