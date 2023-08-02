import { Component } from 'react'
import PropTypes from 'prop-types'

import TaskFilter from '../TaskFilter'

import './Footer.css'

export default class Footer extends Component {
  static defaultProps = {
    todoCount: 0,
    onFilter: () => {},
    onClearСompleted: () => {},
  }

  static propTypes = {
    todoCount: PropTypes.number,
    onFilter: PropTypes.func,
    onClearСompleted: PropTypes.func,
  }

  render() {
    const { todoCount, onFilter, onClearСompleted, activeFilter } = this.props
    //Строка 27 -передаем значение фильтра и массив кнопок-фильтров в TaskFilter
    return (
      <footer className="footer">
        <span className="todo-count">{todoCount} items left</span>
        <TaskFilter onFilter={onFilter} activeFilter={activeFilter} />
        <button className="clear-completed" onClick={onClearСompleted}>
          Clear completed
        </button>
      </footer>
    )
  }
}
