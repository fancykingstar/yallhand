import React from "react"
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw, RichUtils, Modifier } from "draft-js";
import {stateToHTML} from 'draft-js-export-html';
import {S3Upload} from "../DataExchange/S3Upload"
import {GenerateFileName} from "../SharedCalculations/GenerateFileName"
import {emojiList} from "./EmojiList"
import embed from "embed-video";
import draftToHtml from "draftjs-to-html";
import {AccountStore} from "../Stores/AccountStore";

import './style.css'
import {debounce, isEmpty} from "lodash";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export class Wysiwyg extends React.Component {
    constructor(props) {
        super(props);
            if (!this.props.loadContent
              || typeof(this.props.loadContent) === 'object' && isEmpty(this.props.loadContent))
              {
                this.state = {editorState: EditorState.createEmpty(), raw: null, html: null};
              } else {
                const contentState = convertFromRaw(this.props.loadContent);
                this.state={
                    editorState: EditorState.createWithContent(contentState),
                    raw: convertToRaw(contentState),
                    html: stateToHTML(contentState)
                };
        }
        this.onChange = editorState => this.setState({editorState});        
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps && nextProps.isNewVari == true && this.props.isNewVari == false ) {
        this.setState({editorState: EditorState.createEmpty(), raw: null, html: null});
      } else {
        if (!(typeof(nextProps.loadContent) === 'object' && isEmpty(nextProps.loadContent)) && !nextProps.isNewVari && nextProps.variID != this.props.variID) {
          const contentState = convertFromRaw(nextProps.loadContent);
          this.setState({
              editorState: EditorState.createWithContent(contentState),
              raw: convertToRaw(contentState),
              html: stateToHTML(contentState)
          });
        }
      }
    }

    passContent() {
        const contentState = this.state.editorState.getCurrentContent();
        this.setState({
            raw: convertToRaw(contentState),
            html: draftToHtml(convertToRaw(contentState))
        });
        this.props.output(this.state);
      };
   

    editorStateChanged = (newEditorState) => {
      debounce(() => this.passContent(), 500)();
      this.setState({editorState: newEditorState});

    };

    render(){
        const uploadContentImg = async (file) => 
             await S3Upload("public-read", "central", GenerateFileName(AccountStore.account, file.name), file)
              .then(result => {
                return result !== null ? { data: { link: result.file.location}} : null
              } )       
          
        const toolbarConfig = 
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
        
      return (
        <div style={this.props.border !== undefined? {backgroundColor: "#FFFFFF", border: "1px solid", borderColor: this.props.error? "red": "#E8E8E8", borderRadius: 15, padding: 10}: null}>
          <React.Fragment>
            <Editor
              editorState={this.state.editorState}
              onEditorStateChange={this.editorStateChanged}
              toolbar={toolbarConfig}
              editorStyle={{borderRadius: 5, paddingLeft: 5, paddingRight: 5, margin: 0}}
              toolbarStyle={{border: 0}}
            />
          </React.Fragment>
        </div>
      )
    }
}

