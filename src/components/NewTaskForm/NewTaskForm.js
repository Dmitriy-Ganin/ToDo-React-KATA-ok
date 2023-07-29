import { Component } from 'react'
import './NewTaskForm.css'

export default class NewTaskForm extends Component {
  state = {
    label: '',
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
    this.props.onTaskAdded(this.state.label)
    this.setState({
      label: '',
    })
  }

  render() {
    return (
      /*отправка данных формы*/
      <form onSubmit={this.onSubmit}>
        <input
          className="new-todo"
          value={this.state.label}
          placeholder="What needs to be done?"
          //autoFocus
          onChange={this.onLabelChange} // обработчик введенных данных
        />
      </form>
    )
  }
}
