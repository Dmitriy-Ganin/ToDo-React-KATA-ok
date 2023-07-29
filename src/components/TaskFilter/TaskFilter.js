//import React from 'react'
import './TaskFilter.css'

const TaskFilter = (props) => {
  const { onFilter, filters } = props

  return (
    <ul className="filters">
      {filters.map((filter) => (
        <li key={filter.param}>
          {/*key-param*/}
          <button type="button" className={filter.active ? 'selected' : ''} onClick={() => onFilter(filter.param)}>
            {/*onClick={() => onFilter - событие - обработчик клика*/}
            {filter.label} {/*название кнопки*/}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default TaskFilter
