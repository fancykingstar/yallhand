import React from "react"
import {inject, observer} from "mobx-react"

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import {stateToHTML} from 'draft-js-export-html';
import embed from "embed-video";
import draftToHtml from "draftjs-to-html";

import {S3Upload} from "../DataExchange/S3Upload"
import {GenerateFileName} from "../SharedCalculations/GenerateFileName"
import {emojiList} from "./EmojiList"
// import getBlockRenderFunc from "../renderer";
import './style.css'
import _ from "lodash";

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

@inject("DataEntryStore", "AccountStore")
@observer
export class DraftFormField extends React.Component {
    constructor(props) {
        super(props);
        const { DataEntryStore } = this.props;
        this.getLoadOrNew = () => {
            if (this.props.loadContent === 
              null 
              || this.props.loadContent === undefined 
              || typeof(this.props.loadContent) === 'object' && _.isEmpty(this.props.loadContent))
              {
                DataEntryStore.setDraft(
                  "editorState",
                  EditorState.createEmpty()
                );
           
              } else {
                const contentState = convertFromRaw(this.props.loadContent);
                DataEntryStore.setDraft( "editorState", EditorState.createWithContent(contentState) );
                DataEntryStore.toggleDraftContentRAW(convertToRaw(contentState));
                const htmlOutput = stateToHTML(contentState)
                DataEntryStore.toggleDraftContentHTML(htmlOutput);
               
              }
        }
        this.getLoadOrNew()
        this.onChange = editorState => DataEntryStore.setDraft("editorState", editorState);
      }
    componentDidMount() {
      const {DataEntryStore} = this.props
        this.getLoadOrNew()
    }
    render(){
        const {DataEntryStore, AccountStore} = this.props

        // const customBlockType = () => 
        //   getBlockRenderFunc(
        //     {
        //       isReadOnly: this.isReadOnly,
        //       isImageAlignmentEnabled: this.isImageAlignmentEnabled,
        //       getEditorState: this.getEditorState,
        //       onChange: this.onChange
        //     },
        //     props.customBlockRenderFunc
        //   );

        const uploadContentImg = async (file) => 
             await S3Upload("public-read", "quadrance-files/central", GenerateFileName(AccountStore.account, file.name), file)
              .then(result => {
                return result !== null ? { data: { link: result.Location}} : null
              } )

        const editorStateChanged = (newEditorState) => {
            DataEntryStore.setDraft("editorState", newEditorState);
            passContent();
          };

        const passContent = () => {
            const contentState = DataEntryStore.draft.editorState.getCurrentContent();
            DataEntryStore.toggleDraftContentRAW(convertToRaw(contentState));
            const htmlOutput = draftToHtml(convertToRaw(contentState))
            DataEntryStore.toggleDraftContentHTML(htmlOutput);
          };
          
        const toolbarConfig = 
        // this.props.minimal === undefined? 
        {
          options: ['inline', 'list', 'link', 'emoji','history','embedded','image','blockType'], inline: {options: ['bold', 'italic', 'underline', 'strikethrough']},
          blockType: {
            inDropdown: true,
            options: ['Normal', 'H1', 'Blockquote', 'Code'],
            className: undefined,
            component: undefined,
            dropdownClassName: "draftDropdown",
          },
          embedded: {
            embedCallback: link => {
              const detectedSrc = /<iframe.*? src="(.*?)"/.exec(embed(link));
              return (detectedSrc && detectedSrc[1]) || link;
            },
          },
          image: {
            // icon: image,
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            urlEnabled: true,
            uploadEnabled: true,
            alignmentEnabled: true,
            uploadCallback: (e) => uploadContentImg(e),
            previewImage: true,
            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            alt: { present: false, mandatory: false },
            defaultSize: {
              height: 'auto',
              width: 'auto',
            },
          },
          list: {
            options: ['unordered', 'ordered'],
          },
          emoji: {
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            emojis: emojiList,
          },
        } 
        // : {options: ['emoji', 'link']}
        
      return (
        <div style={this.props.border !== undefined? {border: "1px solid", borderColor: "#E8E8E8", borderRadius: 15, padding: 10, marginRight: 20}: null}>
          <React.Fragment>
            <Editor
              wrapperClassName="Wrapped"
              editorState={DataEntryStore.draft.editorState}
              onEditorStateChange={editorStateChanged}
              toolbar={toolbarConfig}
              editorStyle={{backgroundColor: "#ffffff", maxWidth: 900, borderRadius: 5, paddingLeft: 5, paddingRight: 5, minHeight: 200, margin: 0}}   
              toolbarStyle={{backgroundColor: "#f9f9f9", border: 0}}
              plugins={[emojiPlugin]}    
            />
          </React.Fragment>
        </div>
      )
    }
}


