import {DataEntryStore} from "../Stores/DataEntryStore"
import {modifyBundle} from "../DataExchange/Up"
import { EditorState, CompositeDecorator} from "draft-js";
import { queueEdit } from "../DataExchange/PayloadBuilder"



export const flashQueue = () => {
    const decorator = new CompositeDecorator([ { strategy: this.findLinkEntities, component: this.Link } ]);
    DataEntryStore.resetDraft()
    DataEntryStore.setDraft( "editorState", EditorState.createEmpty(decorator) );
    const queueID = DataEntryStore.emailCampaign.queueID
    DataEntryStore.reset("emailCampaign", {sendEmailsConfig: "now", queueID});
    DataEntryStore.set("emailCampaign", "queueSaveSelect", "queue")
    modifyBundle(queueEdit(),false) 
}