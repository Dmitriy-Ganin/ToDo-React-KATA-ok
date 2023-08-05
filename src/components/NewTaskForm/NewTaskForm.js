import { Component } from 'react'
import './NewTaskForm.css'
import PropTypes from 'prop-types'

export default class NewTaskForm extends Component {
  state = {
    label: '',
    minutes: '',
    seconds: '',
  }

  //вызывается, когда input изменяется
  onLabelChange = (e) => {
    this.setState({
      label: e.target.value,
    })
  }

  //обрабатываем
  onSubmit = (e) => {
    //исключение действия по умолчанию (стр не перезагружается)
    e.preventDefault()
    if (this.state.label.trim()) {
      this.props.onTaskAdded(this.state.label.trim(), this.state.minutes, this.state.seconds)
      this.setState({
        label: '',
        minutes: '',
        seconds: '',
      })
    }
  }

  onChangeMinute = (event) => {
    this.setState({
      minutes: Number(event.target.value),
    })
  }

  onChangeSecond = (event) => {
    this.setState({
      seconds: event.target.value,
    })
  }

  render() {
    return (
      /*отправка данных формы*/
      <form className="new-todo-form" onSubmit={this.onSubmit}>
        <input
          className="new-todo"
          value={this.state.label}
          placeholder="What needs to be done?"
          //required
          //pattern="^[^\s]+(\s.*)?$"
          //title="Поле не должно быть пустым"

          onChange={this.onLabelChange} // обработчик введенных данных
        />
        <input
          className="new-todo-form__timer"
          placeholder="Min"
          type="number"
          min={0}
          onChange={this.onChangeMinute}
          value={this.state.minutes}
        ></input>
        <input
          className="new-todo-form__timer"
          type="number"
          placeholder="Sec"
          onChange={this.onChangeSecond}
          value={this.state.seconds}
          min={1}
          max={59}
        ></input>
        <button type="submit" />
      </form>
    )
  }
}

NewTaskForm.defaultProps = {
  onTaskAdded: () => {},
}

NewTaskForm.propTypes = {
  onTaskAdded: PropTypes.func,
}
