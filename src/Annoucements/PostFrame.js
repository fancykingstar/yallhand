import React from 'react'
import {PostControls} from './PostControls'
import {DraftFormField} from '../SharedUI/DraftFormField'
import { PillButton } from '../SharedUI/PillButton';


export const PostFrame = () => {
  const displayContent = (val) => {
    console.log(val)}
  return (
    <div>
    <PostControls/>
    <DraftFormField updateContent={displayContent}/>
    <PillButton iconName="bullhorn" label="post"/>
    </div>
  )
}