import React from 'react'
import {PostContent} from './PostContent'
import {PostControls} from './PostControls'
import { PillButton } from '../SharedUI/PillButton';

export const PostFrame = () => {
  return (
    <div>
    <PostControls/>
    {/* <PostContent/> */}
    <PillButton iconName="bullhorn" label="post"/>
    </div>
  )
}