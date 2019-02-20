import {DataEntryStore} from "../Stores/DataEntryStore"
import {bundle} from "../DataExchange/PayloadBuilder"
import {modifyBundle} from "../DataExchange/Up"
import { EditorState, CompositeDecorator} from "draft-js";



export const flashQueue = () => {
    const decorator = new CompositeDecorator([ { strategy: this.findLinkEntities, component: this.Link } ]);
    DataEntryStore.resetDraft()
    DataEntryStore.setDraft( "editorState", EditorState.createEmpty(decorator) );
    DataEntryStore.reset("emailCampaign")
    DataEntryStore.set("emailCampaign", "queueSaveSelect", "queue")
    modifyBundle(bundle(true),false)
}