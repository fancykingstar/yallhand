import React from "react";
import {AccountStore} from "../Stores/AccountStore";
import { Modal, Form, Header, Message, Dimmer, Loader } from "semantic-ui-react";
import { GenerateFileName } from "../SharedCalculations/GenerateFileName";
import { S3Upload } from "../DataExchange/S3Upload";
import { FormCharMax } from "../SharedValidations/FormCharMax";
import { UploadConfig } from "../SharedUI/UploadConfig";
import { fileResourceEdit, newFile } from "../DataExchange/PayloadBuilder"
import {modifyFile} from "../DataExchange/Up";


export class AttachFile extends React.Component {
  constructor(props){
    super(props);
    this.state={
        loading: false,
        mode: "",
        label: "",
        file: "",
    };
  }

  updateState(obj) {this.setState(obj)};

  componentDidMount() {
      const mode = this.props.mode;
      const assoc = this.props.assoc;
      this.setState({mode: mode? mode : "create", assoc: assoc? assoc : ""})
  }
  
 
  render() {

    const { mode, loading, label, file } = this.state;

    const newLabelStatus = FormCharMax(label, 48);
    const handleSubmit = async (type) => {
      this.setState({loading: true});
      if(type === "update" && file === ""){
        await await modifyFile(fileResourceEdit());
        this.props.close();
        this.props.output("");
        
      }else{
        await S3Upload("authenticated-read", "gramercy", GenerateFileName(AccountStore.account, file.name), file, this.props.assoc? newFile(label, this.props.assoc): newFile(label))
        .then((r) => {
        this.props.close();
        console.log("fileattached to S3 as ", r)
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
          this.setState({file})
        // DataEntryStore.set("fileForUpload", "file", file);
        // DataEntryStore.set("fileForUpload", "url", reader.result);
        // DataEntryStore.set("fileForUpload", "filename", file.name);
      };
      reader.readAsDataURL(file);
    };

    const title =
      this.props.title === undefined
        ? `Upload a new file to associate with this ${
            this.props.mode
          } variation`
        : this.props.title;

    return (
      <React.Fragment>
        <Modal
          closeIcon
          open={this.props.open}
          onClose={e => this.props.close()}
        >
          <Dimmer inverted active={loading}>
          <Loader inverted>Uploading...</Loader>
          </Dimmer>
          <Modal.Header>{title}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Header>{this.props.objLabel}</Header>
              <Form>
                <Form.Group>
                  <Form.Input
                    value={label}
                    label="Descriptive Title (required):"
                    style={{ minWidth: 350 }}
                    onChange={(e, {value}) =>
                      this.updateState({label: value})}
                  >
                    <input maxLength="48" />
                  </Form.Input>
            
                </Form.Group>

    
                <Form.Input
                  label={mode === "replace" ? "Replace File (optional)" : "Add File (required)"}
                  size="mini"
                  id="fileDisplayArea"
                  type="file"
                  style={{ maxWidth: 350 }}
                  onChange={e => handleFileChange(e)}
                />
                
                {/* {this.props.assoc ? <UploadConfig mode={"file"} /> : ""} */}

                <Form.Group>
                    <Form.Button
                    disabled={
                        !label || !file
                        
                    }
                    onClick={e => handleSubmit(mode)}
                    primary
                    >
                    {mode === "create"? "Create" : "Update"}
                    </Form.Button>
             
                  <Form.Button
                    onClick={e => this.props.close()}
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
