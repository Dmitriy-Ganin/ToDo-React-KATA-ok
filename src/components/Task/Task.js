import { useRef, useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import styles from './Task.css'

let cx = classNames.bind(styles)

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

  const inputRef = useRef()
  useEffect(() => {
    if (editing) inputRef.current.focus()
  }, [editing])

  const onTaskEdit = (e) => {
    setStateLabel(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (stateLabel.trim()) {
      onEditEnd(stateLabel.trim(), id)
    }
  }

  const onKeyDownESC = (e) => {
    if (e.key === 'Escape') {
      setStateLabel(description)
      onEditEnd(description, id)
    }
  }

  const onBlurClick = () => {
    setStateLabel(description)
    onEditEnd(description, id)
  }

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
            {description}
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
          <input
            type="text"
            className="edit"
            ref={inputRef}
            value={stateLabel}
            onChange={onTaskEdit}
            onKeyDown={onKeyDownESC}
            onBlur={onBlurClick}
          />
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
