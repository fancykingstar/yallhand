import {DataEntryStore} from "../Stores/DataEntryStore"
import { EditorState, CompositeDecorator} from "draft-js";


export const flashDraft = () => {
    const decorator = new CompositeDecorator([ { strategy: this.findLinkEntities, component: this.Link } ]);
    DataEntryStore.resetDraft()
    DataEntryStore.setDraft( "editorState", EditorState.createEmpty() );
}