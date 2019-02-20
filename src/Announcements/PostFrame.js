import React from 'react'
import {generateID} from "../SharedCalculations/GenerateID"
import {NewEditVariation} from "../SharedUI/NewEditContent/NewEditVariation"




export class PostFrame extends React.Component {

  render() {

  return (
    <div>
      <NewEditVariation mode="announcement" currentObj={generateID()} currentVari={generateID()}/>
    </div>

    



  )}}