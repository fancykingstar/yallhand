import {DataEntryStore} from "../Stores/DataEntryStore"
import { EditorState, CompositeDecorator} from "draft-js";


export const flashDraft = () => {
    DataEntryStore.resetDraft()
    DataEntryStore.setDraft( "editorState", EditorState.createEmpty() );
}