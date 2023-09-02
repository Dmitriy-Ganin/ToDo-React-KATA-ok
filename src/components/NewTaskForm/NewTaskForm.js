import { useState } from 'react'
import './NewTaskForm.css'
import PropTypes from 'prop-types'

export default function NewTaskForm({ onTaskAdded }) {
  const [label, setLabel] = useState('')
  const [minutes, setMin] = useState('')
  const [seconds, setSec] = useState('')

  const onLabelChange = (e) => {
    setLabel(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (label.trim()) {
      onTaskAdded(label.trim(), minutes, seconds)
      setLabel('')
      setMin('')
      setSec('')
    }
  }

  const onEditMinute = (event) => {
    setMin(event.target.value)
  }

  const onEditSecond = (event) => {
    setSec(event.target.value)
  }

  return (
    <form className="new-todo-form" onSubmit={onSubmit}>
      <input className="new-todo" value={label} placeholder="What needs to be done?" onChange={onLabelChange} />
      <input
        className="new-todo-form__timer"
        placeholder="Min"
        type="number"
        min={0}
        onChange={onEditMinute}
        value={minutes}
      ></input>
      <input
        className="new-todo-form__timer"
        type="number"
        placeholder="Sec"
        onChange={onEditSecond}
        value={seconds}
        min={1}
        max={59}
      ></input>
      <button type="submit" />
    </form>
  )
}

NewTaskForm.defaultProps = {
  onTaskAdded: () => {},
}

NewTaskForm.propTypes = {
  onTaskAdded: PropTypes.func,
}
