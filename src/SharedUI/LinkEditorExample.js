import React from "react";
import Editor from "draft-js-plugins-editor";
// import createEmojiPlugin from "draft-js-emoji-plugin";
// import { Button, Icon } from "semantic-ui-react";
import { EditorState, RichUtils, 
  // convertToRaw, convertFromRaw, KeyBindingUtil, Draft, 
  CompositeDecorator } from "draft-js";
import "draft-js-emoji-plugin/lib/plugin.css";
import "draft-js/dist/Draft.css";
import 'draft-js-linkify-plugin/lib/plugin.css';
// import createLinkifyPlugin from 'draft-js-linkify-plugin';
import 'draft-js-counter-plugin/lib/plugin.css';
// import createCounterPlugin from 'draft-js-counter-plugin';
// import {inject, observer} from "mobx-react"
// import { UploadURL } from "./UploadURL.js"
// import { DataEntryStore } from "../Stores/DataEntryStore";
// import { UIStore } from "../Stores/UIStore";
import "./style.css"

  export class LinkEditorExample extends React.Component {
    constructor(props) {
      super(props);
      const decorator = new CompositeDecorator([
        {
          strategy: findLinkEntities,
          component: Link,
        },
      ]);
      this.state = {
        editorState: EditorState.createEmpty(decorator),
        showURLInput: false,
        urlValue: '',
      };
      this.focus = () => this.refs.editor.focus();
      this.onChange = (editorState) => this.setState({editorState});
      // this.logState = () => {
      //   const content = this.state.editorState.getCurrentContent();
      //   console.log(convertToRaw(content));
      // };
      this.promptForLink = this._promptForLink.bind(this);
      this.onURLChange = (e) => this.setState({urlValue: e.target.value});
      this.confirmLink = this._confirmLink.bind(this);
      this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
      this.removeLink = this._removeLink.bind(this);
    }
    _promptForLink(e) {
      e.preventDefault();
      const {editorState} = this.state;
      const selection = editorState.getSelection();
      if (!selection.isCollapsed()) {
        const contentState = editorState.getCurrentContent();
        const startKey = editorState.getSelection().getStartKey();
        const startOffset = editorState.getSelection().getStartOffset();
        const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
        const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
        let url = '';
        if (linkKey) {
          const linkInstance = contentState.getEntity(linkKey);
          url = linkInstance.getData().url;
        }
        this.setState({
          showURLInput: true,
          urlValue: url,
        }, () => {
          setTimeout(() => this.refs.url.focus(), 0);
        });
      }
    }
    _confirmLink(e) {
      e.preventDefault();
      const {editorState, urlValue} = this.state;
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'LINK',
        'MUTABLE',
        {url: urlValue}
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
      this.setState({
        editorState: RichUtils.toggleLink(
          newEditorState,
          newEditorState.getSelection(),
          entityKey
        ),
        showURLInput: false,
        urlValue: '',
      }, () => {
        setTimeout(() => this.refs.editor.focus(), 0);
      });
    }
    _onLinkInputKeyDown(e) {
      if (e.which === 13) {
        this._confirmLink(e);
      }
    }
    _removeLink(e) {
      e.preventDefault();
      const {editorState} = this.state;
      const selection = editorState.getSelection();
      if (!selection.isCollapsed()) {
        this.setState({
          editorState: RichUtils.toggleLink(editorState, selection, null),
        });
      }
    }
    render() {
      let urlInput;
      if (this.state.showURLInput) {
        urlInput =
          <div >
            <input
              onChange={this.onURLChange}
              ref="url"
              
              type="text"
              value={this.state.urlValue}
              onKeyDown={this.onLinkInputKeyDown}
            />
            <button onMouseDown={this.confirmLink}>
              Confirm
            </button>
          </div>;
      }
      return (
        <div >
          <div style={{marginBottom: 10}}>
            Select some text, then use the buttons to add or remove links
            on the selected text.
          </div>
          <div >
            <button
              onMouseDown={this.promptForLink}
              style={{marginRight: 10}}>
              Add Link
            </button>
            <button onMouseDown={this.removeLink}>
              Remove Link
            </button>
          </div>
          {urlInput}
          <div onClick={this.focus}>
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              placeholder="Enter some text..."
              ref="editor"
            />
          </div>
          <input
            onClick={this.logState}
           
            type="button"
            value="Log State"
          />
        </div>
      );
    }
  }
  function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      },
      callback
    );
  }
  const Link = (props) => {
    const {url} = props.contentState.getEntity(props.entityKey).getData();
    return (
      <a href={url}>
        {props.children}
      </a>
    );
  };
