import React from 'react'
import { Input, Dropdown } from "semantic-ui-react"
import './style.css'

const options = [
  { key: 'Newest', text: 'Newest', value: 'Newest' },
  { key: 'Oldest', text: 'Oldest', value: 'Oldest' }
]

export const SortNSearch = (props) => {
    const includeSearch = props.useSearch === undefined? <div/>:
    <div style={{float: "right"}}>  
      <Input icon='search' placeholder='Search...' 
      onChange={(e, val) => props.searchValueChange(val.value)} 
      value={props.searchValue}
      />
     </div> 

    return(
    <div className="CardSort">
        {includeSearch}     
     <div style={{float: "left"}}> 
    <span>
      Sort by{' '}
      <Dropdown 
      inline options={options} 
      defaultValue={options[0].value} 
      onChange= {(e, {value}) => props.dropdownValueChange(value)} />
    
    </span>
  </div>

  </div>
    )}
  

