import { Component } from 'react'
//import React from 'react'
import PropTypes from 'prop-types'
import './TaskFilter.css'

export default class TasksFilter extends Component {
  filters = [{ label: 'all' }, { label: 'active' }, { label: 'completed' }]
  render() {
    const { activeFilter, onFilter } = this.props

    const buttons = this.filters.map(({ label }) => {
      const isActive = activeFilter === label
      const classFilter = isActive ? 'selected' : null
      return (
        <li key={label}>
          <button className={classFilter} onClick={() => onFilter(label)}>
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </button>
        </li>
      )
    })

    return <ul className="filters">{buttons}</ul>
  }
}

TasksFilter.defaultProps = {
  onFilter: () => {},
}

TasksFilter.propTypes = {
  activeFilter: PropTypes.string,
  onFilter: PropTypes.func.isRequired,
}
