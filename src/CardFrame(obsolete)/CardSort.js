import React from 'react'
import { Dropdown, Input } from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import './style.css'

const options = [
  { key: 'Newest', text: 'Newest', value: 'Newest' },
  { key: 'Oldest', text: 'Oldest', value: 'Oldest' }
]



const CardSort = inject("PoliciesStore", "UIStore")(
    observer((props) => {
      const handleSearch = val => {
        UIStore.set("search", "searchPolicies", val) 
      
      };
    const {UIStore} = props
    return(
    <div className="CardSort">
     <div style={{float: "right"}}>  <Input icon='search' placeholder='Search...' 
     onChange={(e, val) => handleSearch(val.value)} 
     value={UIStore.search.searchPolicies}
     /></div>
     <div style={{float: "left"}}> 
  <span>
    Sort by{' '}
    <Dropdown inline options={options} defaultValue={options[0].value} onChange= {(e, {value}) => UIStore.set("dropdown", "policySort", value)} />
   
  </span></div>

  </div>
    )}))
  
export default CardSort
