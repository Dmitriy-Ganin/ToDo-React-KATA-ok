import { useState } from 'react'
import './NewTaskForm.css'
import PropTypes from 'prop-types'

export default function NewTaskForm({ onTaskAdded }) {
  const [label, setLabel] = useState('')
  const [minutes, setMin] = useState('')
  const [seconds, setSec] = useState('')

  //export default class NewTaskForm extends Component {
  // state = {
  // label: '',
  // minutes: '',
  // seconds: '',
  // }

  //вызывается, когда input изменяется
  const onLabelChange = (e) => {
    setLabel(e.target.value)
  }

  //обрабатываем
  const onSubmit = (e) => {
    //исключение действия по умолчанию (стр не перезагружается)
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
    /*отправка данных формы*/
    <form className="new-todo-form" onSubmit={onSubmit}>
      <input
        className="new-todo"
        value={label}
        placeholder="What needs to be done?"
        //required
        //pattern="^[^\s]+(\s.*)?$"
        //title="Поле не должно быть пустым"

        onChange={onLabelChange} // обработчик введенных данных
      />
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
