import React, { Component } from 'react';
import './NewTaskForm.css';

export default class NewTaskForm extends Component {
  state = {
    label: '',
  };

  onLabelChange = (e) => {
    this.setState({
      label: e.target.value,
    });
  };

  onSubmit = (e) => {
    //исключение действия по умолчанию (стр не перезагружается)
    e.preventDefault();
    this.props.onTaskCreate(this.state.label);
    this.setState({
      label: '',
    });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input
          className="new-todo"
          value={this.state.label}
          placeholder="What needs to be done?"
          autoFocus
          onChange={this.onLabelChange}
        />
      </form>
    );
  }
}
