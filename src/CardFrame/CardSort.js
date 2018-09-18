import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import './style.css'

const options = [
  { key: 1, text: 'Newest', value: 1 },
  { key: 2, text: 'Oldest', value: 2 }
]

const CardSort = () => (
  <div className="CardSort">
  <span>
    Sort by{' '}
    <Dropdown inline options={options} defaultValue={options[0].value} />
  </span>

  </div>
)

export default CardSort
