import React, { Component } from 'react';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import './Task.css';

export default class Task extends Component {
  static defaultProps = {
    completed: false,
    editing: false,
    id: 100,
    description: '',
    createTime: new Date(),
    onComplete: () => {},
    onEditStart: () => {},
    onDeleted: () => {},
  };

  static propTypes = {
    completed: PropTypes.bool,
    editing: PropTypes.bool,
    id: PropTypes.number,
    description: PropTypes.string,
    createTime: PropTypes.instanceOf(Date),
    onComplete: PropTypes.func,
    onEditStart: PropTypes.func,
    onDeleted: PropTypes.func,
  };

  state = {
    taskLabel: this.props.description,
  };
  //изменение задачи. начало
  onTaskEdit = (e) => {
    this.setState({
      //получаем текущее значение инпута
      taskLabel: e.target.value,
    });
  };
  //вызываем перед отправкой данных формы
  //e содержит информацию о событии, которое наступило, и делали этого события
  onSubmitHandler = (e) => {
    //отменяет перезагрузку страницы
    e.preventDefault();
    //получаем onEditEnd и id из props
    const { onEditEnd, id } = this.props;
    //получаем taskLabel из state (стр 29-30)
    const { taskLabel } = this.state;
    //изменение задачи. начало
    onEditEnd(taskLabel, id);
  };

  getEditField = () => {
    //извлекаем из props editing, по нему смотрим на изменении или нет
    const { editing } = this.props;
    //если на изменении, выводим инпут
    if (editing) {
      return (
        //событие, происходящее перед отправкой формы вызывает функцию onSubmitHandler
        <form onSubmit={this.onSubmitHandler}>
          <input type="text" className="edit" value={this.state.taskLabel} onChange={this.onTaskEdit} />
        </form>
      );
    }
  };

  render() {
    const { completed, editing, id, description, createTime, onComplete, onEditStart, onDeleted } = this.props;

    const classNames = [completed ? 'completed' : '', editing ? 'editing' : ''].join(' ');

    return (
      <li className={classNames} key={id}>
        <div className="view">
          <input className="toggle" type="checkbox" id={`${id}__check`} onChange={onComplete} checked={completed} />
          <label htmlFor={`${id}__check`}>
            <span className="description">{description}</span>
            <span className="created">{formatDistanceToNow(createTime)}</span>
          </label>
          <button className="icon icon-edit" onClick={onEditStart} />
          <button className="icon icon-destroy" onClick={onDeleted} />
        </div>

        {this.getEditField()}
      </li>
    );
  }
}
