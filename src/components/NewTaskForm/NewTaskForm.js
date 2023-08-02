import { Component } from 'react'
import './NewTaskForm.css'
//import PropTypes from 'prop-types'

//NewTaskForm.defaultProps = {
// onLabelChange: () => {},
// onSubmit: () => {},
//}

//NewTaskForm.propTypes = {
// onLabelChange: PropTypes.func,
// onSubmit: PropTypes.func,
//}

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
    if (this.state.label.trim()) {
      this.props.onTaskAdded(this.state.label.trim())
      this.setState({
        label: '',
      })
    }
  }

  render() {
    return (
      /*отправка данных формы*/
      <form onSubmit={this.onSubmit}>
        <input
          className="new-todo"
          value={this.state.label}
          placeholder="What needs to be done?"
          //required
          //pattern="^[^\s]+(\s.*)?$"
          //title="Поле не должно быть пустым"
          onChange={this.onLabelChange} // обработчик введенных данных
        />
      </form>
    )
  }
}
