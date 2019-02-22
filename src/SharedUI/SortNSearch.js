import React from 'react'
import { Input, Dropdown } from "semantic-ui-react"
import './style.css'

const options = [
  { key: 'Newest', text: 'Newest', value: 'Newest' },
  { key: 'Oldest', text: 'Oldest', value: 'Oldest' }
]

export const SortNSearch = (props) => {

    return(
    <div className="CardSort">
     <div style={{float: "right"}}>  <Input icon='search' placeholder='Search...' 
     onChange={(e, val) => props.searchValueChange(val.value)} 
     value={props.searchValue}
     /></div>
     <div style={{float: "left"}}> 
  <span>
    Sort by{' '}
    <Dropdown inline options={options} defaultValue={options[0].value} onChange= {(e, {value}) => props.dropdownValueChange(value)} />
   
  </span></div>

  </div>
    )}
  

