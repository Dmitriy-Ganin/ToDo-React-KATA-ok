import { Component } from 'react'
import PropTypes from 'prop-types'

import Task from '../Task'
import './TaskList.css'

export default class TaskList extends Component {
  static defaultProps = {
    tasks: [],
    onComplete: () => {},
    onDeleted: () => {},
    onEditStart: () => {},
    onEditEnd: () => {},
    startTimer: () => {},
    pauseTimer: () => {},
  }

  static propTypes = {
    tasks: PropTypes.array,
    onComplete: PropTypes.func,
    onDeleted: PropTypes.func,
    onEditStart: PropTypes.func,
    onEditEnd: PropTypes.func,
    startTimer: PropTypes.func,
    pauseTimer: PropTypes.func,
  }

  state = {
    minutes: this.props.tasks.minutes,
    seconds: this.props.tasks.seconds,
  }

  render() {
    const { tasks, onComplete, onDeleted, onEditStart, onEditEnd, startTimer, pauseTimer } = this.props
    const taskElements = tasks.map((task) => (
      <Task
        {...task}
        key={task.id}
        minutes={task.minutes}
        seconds={task.seconds}
        //передаю в функцию помечания выполненной задачи ее id
        onComplete={() => onComplete(task.id)}
        //передаю в функцию удаления задачи ее id
        onDeleted={() => onDeleted(task.id)}
        //передаю в функцию начала изменения задачи ее id
        onEditStart={() => onEditStart(task.id)}
        onEditEnd={(taskLabel, id) => onEditEnd(taskLabel, id)}
        startTimer={() => startTimer(task.id)}
        pauseTimer={() => pauseTimer(task.id)}
      />
    ))

    return <ul className="todo-list">{taskElements}</ul>
  }
}
