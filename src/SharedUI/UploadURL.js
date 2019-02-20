import React from "react";
import { inject, observer } from "mobx-react";
import {
  Modal,
  Form,
  Header,
  Message,
  Dropdown,
  Input,
  Transition
} from "semantic-ui-react";
import { FormCharMax } from "../SharedValidations/FormCharMax";
import { UploadConfig } from "../SharedUI/UploadConfig";

@inject("UIStore", "DataEntryStore")
@observer
export class UploadURL extends React.Component {
  render() {
    const { UIStore } = this.props;
    const { DataEntryStore } = this.props;
    const newLabelStatus = FormCharMax(DataEntryStore.urlForUpload.label, 48);

    const handleSubmit = type => {
      this.props.onSubmit(type);
      UIStore.set("modal", "uploadAssocEdit", false);
      UIStore.set("modal", "uploadURL", false);
      DataEntryStore.reset("urlForUpload", {
        prefix: "https://",
        teamID: "global",
        tagID: "none",
        associations: { policies: [], announcements: [] }
      });
    };
    
    const handleURLinput = val => {
      let currentURL = val;
      switch (currentURL.slice(0, 5)) {
        case "https":
          UIStore.toggleTransition("urlAutoFormat");
          DataEntryStore.set("urlForUpload", "prefix", "https://");
          DataEntryStore.set("urlForUpload", "url", currentURL.split("//")[1]);
          setTimeout(() => {
            UIStore.toggleTransition("urlAutoFormat");
          }, 300);
          break;
        case "http:":
          UIStore.toggleTransition("urlAutoFormat");
          DataEntryStore.set("urlForUpload", "prefix", "http://");
          DataEntryStore.set("urlForUpload", "url", currentURL.split("//")[1]);
          setTimeout(() => {
            UIStore.toggleTransition("urlAutoFormat");
          }, 300);
          break;
        default:
          DataEntryStore.set("urlForUpload", "url", val);
          break;
      }
    };

    const httpWarning =
      DataEntryStore.urlForUpload.prefix === "http://" ? (
        <p style={{ fontSize: ".8em", marginTop: 5, marginBottom: 10 }}>
          🎈 Be careful following this link as unsecured URLs may be unsafe.
        </p>
      ) : null;

    const title =
      this.props.title === undefined
        ? `Select or create a new URL to associate with this ${
            this.props.mode
          } variation`
        : this.props.title;
    const useConfig = UIStore.modal.uploadAssocEdit ? (
      <UploadConfig mode={"url"} />
    ) : null;

    const CreateOrUpdate = !DataEntryStore.urlForUpload.isNew ? (
      <Form.Button
        disabled={
          DataEntryStore.urlForUpload.label === "" ||
          DataEntryStore.urlForUpload.url === ""
        }
        onClick={e => handleSubmit("update")}
        primary
      >
        Update
      </Form.Button>
    ) : (
      <Form.Button
        disabled={
          DataEntryStore.urlForUpload.label === "" ||
          DataEntryStore.urlForUpload.url === ""
        }
        onClick={e => handleSubmit("create")}
        primary
      >
        Create
      </Form.Button>
    );

    return (
      <React.Fragment>
        <Modal
          closeIcon
          open={this.props.open}
          onClose={e => UIStore.set("modal", "uploadURL", false)}
        >
          <Modal.Header>{title}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Header>{this.props.objLabel}</Header>
              <Form>
                <Form.Input
                  value={DataEntryStore.urlForUpload.label}
                  label="Descriptive Title (required):"
                  style={{ minWidth: 350 }}
                  onChange={(e, val) =>
                    DataEntryStore.set("urlForUpload", "label", val.value)
                  }
                >
                  <input maxLength="48" />
                </Form.Input>

                <Transition
                  animation="pulse"
                  duration={300}
                  visible={UIStore.transition.urlAutoFormat}
                >
                  <Input
                    value={DataEntryStore.urlForUpload.url}
                    onChange={(e, val) => handleURLinput(val.value)}
                    placeholder="Enter or paste a URL here..."
                    label={
                      <Dropdown
                        onChange={(e, val) =>
                          DataEntryStore.set(
                            "urlForUpload",
                            "prefix",
                            val.value
                          )
                        }
                        value={DataEntryStore.urlForUpload.prefix}
                        options={[
                          {
                            key: "https://",
                            text: "https://",
                            value: "https://"
                          },
                          { key: "http://", text: "http://", value: "http://" },
                          { key: "none", text: "://", value: "" }
                        ]}
                      />
                    }
                    labelPosition="left"
                    style={{ width: "80%" }}
                  />
                </Transition>
                {httpWarning}
                <p style={{ marginTop: 10, fontSize: "1em" }}>
                  Link preview:{" "}
                  {DataEntryStore.urlForUpload.url !== "" &&
                  DataEntryStore.urlForUpload.label !== "" ? (
                    <a
                      href={
                        DataEntryStore.urlForUpload.prefix +
                        DataEntryStore.urlForUpload.url
                      }
                      target="_blank"
                    >
                      {DataEntryStore.urlForUpload.label}
                    </a>
                  ) : null}
                </p>

                {useConfig}

                <Form.Group>
                  {CreateOrUpdate}
                  <Form.Button
                    onClick={e => UIStore.set("modal", "uploadURL", false)}
                  >
                    Cancel
                  </Form.Button>
                </Form.Group>
              </Form>
              <Message error attached hidden={newLabelStatus.messageHide}>
                {newLabelStatus.message}
              </Message>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    );
  }
}
