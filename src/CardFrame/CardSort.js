import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import './style.css'

const options = [
  { key: 'Newest', text: 'Newest', value: 'Newest' },
  { key: 'Oldest', text: 'Oldest', value: 'Oldest' }
]

const CardSort = inject("PoliciesStore")(
  observer(({ PoliciesStore }) => (
    <div className="CardSort">
  <span>
    Sort by{' '}
    <Dropdown inline options={options} defaultValue={options[0].value} onChange= {(e, {value}) => PoliciesStore.updateCardSort(value)} />
   
  </span>

  </div>
    ))
    );

export default CardSort
