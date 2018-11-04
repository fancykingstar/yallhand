import React from 'react'
import {PostControls} from './PostControls'
import {DraftFormField} from '../SharedUI/DraftFormField'
import { PillButton } from '../SharedUI/PillButton';
import {Button} from 'semantic-ui-react'

export class PostFrame extends React.Component {
  constructor(props) {
  super(props)
  this.state = {current : ''}
  }
  render() {
  let content = ''
  const handleSave = (e) => {
    e.preventDefault()
    this.setState({current: content})
  }
  const displayContent = (val) => {
    content = val

  }

  return (
    <div>
    <PostControls/>
    <DraftFormField updateContent={displayContent}/>
    <Button onClick={e => handleSave(e)}>Save</Button><Button>Load</Button>
    <PillButton iconName="bullhorn" label="post"/>
    </div>
    //This will need to load convert from raw if value when loading
    



  )}}