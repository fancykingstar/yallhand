import React from "react"
import {inject, observer} from "mobx-react"

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, RichUtils, convertToRaw, convertFromRaw, CompositeDecorator } from "draft-js";
import {stateToHTML} from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

@inject("DataEntryStore")
@observer
export class DraftFormField extends React.Component {
    constructor(props) {
        super(props);
        const { DataEntryStore } = this.props;
        this.getLoadOrNew = () => {
            if (this.props.loadContent === null || this.props.loadContent === undefined) {
                DataEntryStore.setDraft(
                  "editorState",
                  EditorState.createEmpty()
                );
           
              } else {
                const contentState = convertFromRaw(this.props.loadContent);
                DataEntryStore.setDraft( "editorState", EditorState.createWithContent(contentState) );
               
              }
        }
        this.getLoadOrNew()
        this.onChange = editorState => DataEntryStore.setDraft("editorState", editorState);
      }
    componentDidMount() {
        this.getLoadOrNew()
    }
    render(){
        const {DataEntryStore} = this.props

        const editorStateChanged = (newEditorState) => {
            DataEntryStore.setDraft("editorState", newEditorState);
            passContent();
          };

        const passContent = () => {
            const contentState = DataEntryStore.draft.editorState.getCurrentContent();
            DataEntryStore.toggleDraftContentRAW(convertToRaw(contentState));
            const htmlOutput = stateToHTML(contentState)
            DataEntryStore.toggleDraftContentHTML(htmlOutput);
          };
          
        const toolbarConfig = this.props.minimal === undefined? {options: ['inline', 'list', 'link', 'emoji', 'remove', 'history'], inline: {options: ['bold', 'italic', 'underline', 'strikethrough']}} : {options: ['emoji', 'link']}
        
        return (
                <div style={this.props.border !== undefined? {border: "1px solid", borderColor: "#E8E8E8", borderRadius: 15, padding: 10, marginRight: 20}: null}>
                <Editor
                wrapperClassName="Wrapped"
                editorState={DataEntryStore.draft.editorState}
                onEditorStateChange={editorStateChanged}
                toolbar={toolbarConfig}
                editorStyle={{backgroundColor: "#ffffff", maxWidth: 900, borderRadius: 5, paddingLeft: 5, paddingRight: 5, minHeight: 200, margin: 0}}   
                toolbarStyle={{backgroundColor: "#f9f9f9", border: 0}}     
                        
                        />
                </div>
          
    )
        }
}


