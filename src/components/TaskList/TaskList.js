import PropTypes from 'prop-types'

import Task from '../Task'
import './TaskList.css'

export const TaskList = ({ tasks, onComplete, onDeleted, onEditStart, onEditEnd, startTimer, pauseTimer }) => {
  const taskElements = tasks.map((task) => {
    return (
      <Task
        {...task}
        key={task.id}
        minutes={task.minutes}
        seconds={task.seconds}
        onComplete={() => onComplete(task.id)}
        onDeleted={() => onDeleted(task.id)}
        onEditStart={() => onEditStart(task.id)}
        onEditEnd={(taskLabel, id) => onEditEnd(taskLabel, id)}
        startTimer={() => startTimer(task.id)}
        pauseTimer={() => pauseTimer(task.id)}
      />
    )
  })

  return <ul className="todo-list">{taskElements}</ul>
}

TaskList.defaultProps = {
  tasks: [],
  onComplete: () => {},
  onDeleted: () => {},
  onEditStart: () => {},
  onEditEnd: () => {},
  startTimer: () => {},
  pauseTimer: () => {},
}

TaskList.propTypes = {
  tasks: PropTypes.array,
  onComplete: PropTypes.func,
  onDeleted: PropTypes.func,
  onEditStart: PropTypes.func,
  onEditEnd: PropTypes.func,
  startTimer: PropTypes.func,
  pauseTimer: PropTypes.func,
}
