import React from "react";
import { inject, observer } from "mobx-react";
import {
  Select,
  Icon,
  Segment,
  Header,
  Accordion,
  Button,
  Form
} from "semantic-ui-react";
import { DraftFormField } from "../SharedUI/DraftFormField";
import {withRouter} from "react-router-dom"
import { ContentSearch } from "../SharedUI/ContentSearch";
import { BundleContent } from "../SharedUI/Bundle/BundleContent";
import BackButton from "../SharedUI/BackButton";
import { arrayValUpOrDown } from "../SharedCalculations/ArrayValUpOrDown";
import _ from "lodash";
import { ConfirmDelete } from "../SharedUI/ConfirmDelete";
import { bundleEdit } from "../DataExchange/PayloadBuilder"
import { modifyBundle, deleteBundle } from "../DataExchange/Up";


@inject("UIStore", "DataEntryStore", "EmailStore")
@observer
class EditBundle extends React.Component {
  render() {
    const { UIStore, DataEntryStore, EmailStore } = this.props;
    const handleAccClick = e => {
      e.preventDefault();
      UIStore.set("accordion", "editBundle", !UIStore.accordion.editBundle);
    };
    const bundlePopulated =
      DataEntryStore.emailCampaign.editBundleBundle.length === 0;

    const updateBundle = () => {
      modifyBundle(bundleEdit()).then(() => {
                // DataEntryStore.resetDraft()
        DataEntryStore.reset("emailCampaign")
        EmailStore.reset("queue")
        this.props.history.push('/panel/email')
      })
    }
        
      
    const remove = val => {
      const updatedBundle= DataEntryStore.emailCampaign.editBundleBundle.filter(
        item => Object.values(item)[0] !== Object.values(val)[0]
      );
      DataEntryStore.set("emailCampaign", "editBundleBundle", updatedBundle);
    };
    const moveUp = val => {
      DataEntryStore.set(
        "emailCampaign",
        "editBundleBundle",
        arrayValUpOrDown(
          DataEntryStore.emailCampaign.editBundleBundle,
          val,
          "up"
        )
      );
    };
    const moveDown = val => {
      DataEntryStore.set(
        "emailCampaign",
        "editBundleBundle",
        arrayValUpOrDown(
          DataEntryStore.emailCampaign.editBundleBundle,
          val,
          "down"
        )
      );
    };


    const updateSelectedContent = (item) => {
      if(item.type === "policy") {
        const updatedBundle = DataEntryStore.emailCampaign.editBundleBundle.slice()
        updatedBundle.push({"policyID": item.value})
        DataEntryStore.set("emailCampaign", "editBundleBundle", updatedBundle)
      } 
    }
   

    return (
      <div style={{ minWidth: 400, maxWidth: 850 }}>
        <BackButton />
        <Header
          as="h2"
          content="Edit Bundle"
        />
        <p style={{ fontWeight: "800", marginBottom: 0 }}>Stage </p>
        <Select
          style={{ marginTop: 5 }}
          compact={true}
          label="Stage"
          onChange={(e, val) => DataEntryStore.set("emailCampaign", "editBundleStage", val.value)}

          value={DataEntryStore.emailCampaign.editBundleStage}
          options={[
            { text: "Active", value: "active" },
            { text: "Archived", value: "archived" }
          ]}
        />

        <Form style={{ marginTop: 5 }}>
          <Form.Input
            label="Bundle Title"
            value={DataEntryStore.emailCampaign.editBundleLabel}
            onChange={(e, val) =>
              DataEntryStore.set("emailCampaign", "editBundleLabel", val.value)
            }
          />

          <Form.Input
            label="Email Subject"
            value={DataEntryStore.emailCampaign.editBundleSubject}
            onChange={(e, val) =>
              DataEntryStore.set(
                "emailCampaign",
                "editBundleSubject",
                val.value
              )
            }
          />
        </Form>
        <Accordion>
          <Accordion.Title
            active={UIStore.accordion.editBundle}
            onClick={e => handleAccClick(e)}
          >
            <Icon name="dropdown" />
            Intro Body (Optional)
          </Accordion.Title>
          <Accordion.Content
          active={UIStore.accordion.editBundle}
          >
            <DraftFormField
              loadContent={
                _.isEmpty(DataEntryStore.emailCampaign.editBundleDraft)
                  ? null
                  : DataEntryStore.emailCampaign.editBundleDraft
              }
            />
          </Accordion.Content>
        </Accordion>
        <br/><br/>
         <ContentSearch
        output={res => updateSelectedContent(res)}/>
        {bundlePopulated ? (
          <h5 style={{ fontStyle: "italic" }}>
            This bundle is empty.
          </h5>
        ) : (
          <BundleContent
            input={DataEntryStore.emailCampaign.editBundleBundle}
            remove={val => remove(val)}
            moveUp={val => moveUp(val)}
            moveDown={val => moveDown(val)}
          />
        )}
        <div style={{marginLeft: 8}}><Form>
        <Form.Group>
        <Button primary onClick={e => updateBundle()}>Update</Button>
        {DataEntryStore.emailCampaign.editBundleLastUsed === 0 ? <ConfirmDelete label="bundle" confirm={e => deleteBundle(DataEntryStore.emailCampaign.editBundleID).then(() => this.props.history.push('/panel/email'))} /> : null}
        </Form.Group>
        </Form>
   </div>
        

        <br />
      </div>
    );
  }
}
export default withRouter(EditBundle)