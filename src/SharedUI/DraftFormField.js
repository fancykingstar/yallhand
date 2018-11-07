import React, { Component } from "react";
import Editor from "draft-js-plugins-editor";
import createEmojiPlugin from "draft-js-emoji-plugin";
import { Button, Icon } from "semantic-ui-react";
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import "draft-js-emoji-plugin/lib/plugin.css";
import "draft-js/dist/Draft.css";
import 'draft-js-linkify-plugin/lib/plugin.css';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import 'draft-js-counter-plugin/lib/plugin.css';
import createCounterPlugin from 'draft-js-counter-plugin';
import {inject, observer} from "mobx-react"
import { DataEntryStore } from "../Stores/DataEntryStore";


const counterPlugin = createCounterPlugin();
const { WordCounter } = counterPlugin;
const emojiPlugin = createEmojiPlugin();
const linkifyPlugin = createLinkifyPlugin();
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const plugins = [emojiPlugin, linkifyPlugin, counterPlugin];


@inject("DataEntryStore")
@observer
export class DraftFormField extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });
  }

   editorStateChanged = (newEditorState: EditorState) =>
     this.setState({ editorState: newEditorState });

   handleKeyCommand = (command: string) => {
     const newState = RichUtils.handleKeyCommand(
       this.state.editorState,
       command
     );
     if (newState) {
       this.editorStateChanged(newState);
       return "handled";
     }
     return "not-handled";
   };

   passContent = () => {

    const contentState = this.state.editorState.getCurrentContent();
    DataEntryStore.toggleDraftContent(convertToRaw(contentState))
    // this.props.updateContent(convertToRaw(contentState))
    
    
   }

   _onBoldClick() {
     this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
   }
   _onUlineClick() {
     this.onChange(
       RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
     );
   }
   _onItalicClick() {
     this.onChange(
       RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC")
     );
   }
   _onUlClick() {
     this.onChange(
       RichUtils.toggleBlockType(this.state.editorState, "unordered-list-item")
     );
   }
   _onOlClick() {
     this.onChange(
       RichUtils.toggleBlockType(this.state.editorState, "ordered-list-item")
     );
   }

  render() {
    return (
      <div className="Answer">
        <div onClick={this.focus}>
          <Button.Group>
            <Button icon onClick={this._onBoldClick.bind(this)}>
              <Icon name="bold" />
            </Button>
            <Button icon onClick={this._onUlineClick.bind(this)}>
              <Icon name="underline" />
            </Button>
            <Button icon onClick={this._onItalicClick.bind(this)}>
              <Icon name="italic" />
            </Button>
            <Button icon onClick={this._onUlClick.bind(this)}>
              <Icon name="unordered list" />
            </Button>
            <Button icon onClick={this._onOlClick.bind(this)}>
              <Icon name="ordered list" />
            </Button>
          </Button.Group>
          <div className="AnswerField">
            <Editor
              onBlur={this.passContent}
              editorState={this.state.editorState}
              onChange={this.editorStateChanged}
              handleKeyCommand={this.handleKeyCommand}
              plugins={plugins}
              ref={element => {
                this.editor = element;
              }}
            />
          </div>

          <EmojiSuggestions />
        </div>
        <div style={{float: "left", paddingTop: 5}}><WordCounter limit={200} /> words</div>
        <div style={{ float: "right", paddingTop: 5}}>
          <EmojiSelect /> 
        </div> 
        <div className="EmojiLicense">Emoji by <a style={{color: 'rgb(179, 179, 179)' }} href="https://joypixels.com" rel="noopener noreferrer" target="_blank">JoyPixels</a>  </div>
      </div>
    );
  }
}
