import { Component } from 'react'
//import React from 'react'
import './TaskFilter.css'

export default class TasksFilter extends Component {
  filters = [{ label: 'all' }, { label: 'active' }, { label: 'completed' }]
  render() {
    const { activefilter, onFilter } = this.props

    const buttons = this.filters.map(({ label }) => {
      const isActive = activefilter === label
      const clazz = isActive ? 'selected' : null
      return (
        <li key={label}>
          <button className={clazz} onClick={() => onFilter(label)}>
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </button>
        </li>
      )
    })

    return <ul className="filters">{buttons}</ul>
  }
}
