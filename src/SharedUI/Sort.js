import React from 'react'
import { Dropdown } from "semantic-ui-react"
import './style.css'

const options = [
  { key: 'Newest', text: 'Newest', value: 'Newest' },
  { key: 'Oldest', text: 'Oldest', value: 'Oldest' }
]

export const Sort = (props) => {

    return(
    <span>
      Sort by{' '}
      <Dropdown 
      inline options={options} 
      defaultValue={options[0].value} 
      onChange= {(e, {value}) => props.dropdownValueChange(value)} />
    </span>
    )}
  

