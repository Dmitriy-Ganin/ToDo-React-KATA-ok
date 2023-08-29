import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import styles from './Task.css'

let cx = classNames.bind(styles)

//export default class Task extends Component {
export function Task(props) {
  const {
    completed,
    editing,
    id,
    description,
    createTime,
    onComplete,
    onEditStart,
    onEditEnd,
    onDeleted,
    startTimer,
    pauseTimer,
    minutes,
    seconds,
  } = props

  const [stateLabel, setStateLabel] = useState(description)
  //изменение задачи. начало
  const onTaskEdit = (e) => {
    setStateLabel(e.target.value)
  }
  //вызываем перед отправкой данных формы
  //e содержит информацию о событии, которое наступило, и делали этого события
  const onSubmit = (e) => {
    //отменяет перезагрузку страницы
    e.preventDefault()
    //получаем onEditEnd и id из props
    //const { onEditEnd, id } = this.props
    //получаем taskLabel из state (стр 29-30)
    //const { taskLabel } = this.state
    if (stateLabel.trim()) {
      //изменение задачи. начало
      onEditEnd(stateLabel.trim(), id)
    }
  }

  //getEditField = () => {
  //извлекаем из props editing, по нему смотрим на изменении или нет
  // const { editing } = this.props
  //если на изменении, выводим инпут
  // if (editing) {
  //  return (
  //событие, происходящее перед отправкой формы вызывает функцию onSubmitHandler
  //   <form onSubmit={this.onSubmit}>
  //     <input type="text" className="edit" value={this.state.taskLabel} onChange={this.onTaskEdit} />
  //   </form>
  // )
  //}
  //}

  // const classNames = [completed ? 'completed' : '', editing ? 'editing' : ''].join(' ')
  let btnClass = cx({
    '': true,
    completed: completed,
    editing: editing,
  })
  return (
    <li className={btnClass}>
      <div className="view">
        <input className="toggle" type="checkbox" id={`${id}__check`} onChange={onComplete} checked={completed} />
        <label htmlFor={`${id}__check`}>
          <span className="title">
            {stateLabel}
            <button className="icon icon-play" onClick={startTimer}></button>
            <button className="icon icon-pause" onClick={pauseTimer}></button>
            {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
          <span className="created">{formatDistanceToNow(createTime)}</span>
        </label>
        <button className="icon icon-edit" onClick={onEditStart} />
        <button className="icon icon-destroy" onClick={onDeleted} />
      </div>

      {editing && (
        <form onSubmit={onSubmit}>
          <input type="text" className="edit" value={stateLabel} onChange={onTaskEdit} />
        </form>
      )}
    </li>
  )
}

Task.defaultProps = {
  completed: false,
  editing: false,
  id: 100,
  description: '',
  createTime: new Date(),
  min: 0,
  sec: 0,
  onComplete: () => {},
  onEditStart: () => {},
  onDeleted: () => {},
}

Task.propTypes = {
  completed: PropTypes.bool,
  editing: PropTypes.bool,
  id: PropTypes.number,
  description: PropTypes.string,
  createTime: PropTypes.instanceOf(Date),
  onComplete: PropTypes.func,
  onEditStart: PropTypes.func,
  onDeleted: PropTypes.func,
  min: PropTypes.number,
  sec: PropTypes.number,
}
