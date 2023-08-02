import { Component } from 'react'

import Footer from '../Footer'
import NewTaskForm from '../NewTaskForm'
import TaskList from '../TaskList'

import './App.css'

export default class App extends Component {
  maxId = 0

  state = {
    tasks: [],
    activefilter: 'all', //фильтр по умолчанию
  }
  //создание задачи
  createNewTask = (label) => ({
    description: label,
    createTime: new Date(),
    completed: false,
    editing: false,
    id: this.maxId++,
  })

  //Изменение статуса задачи
  toggleProperty = (arr, id, prop) => {
    const index = arr.findIndex((el) => el.id === id)
    // 1. update object
    const oldItem = arr[index]
    const newItem = { ...oldItem, [prop]: !oldItem[prop] }
    // 2. construct new array
    const before = arr.slice(0, index)
    const after = arr.slice(index + 1)

    return [...before, newItem, ...after]
  }

  //фильтр в зависимости от состояния задачи
  getFilteredTasks = () => {
    const { activefilter, tasks } = this.state
    console.log(activefilter)
    switch (activefilter) {
      //все
      case 'all':
        return tasks
      //выполненные
      case 'active':
        return tasks.filter((task) => !task.completed)
      //активные
      case 'completed':
        return tasks.filter((task) => task.completed)
      default:
        return tasks
    }
  }
  //помечаем задачу как выполненную
  onComplete = (id) => {
    this.setState((state) => ({
      tasks: this.toggleProperty(state.tasks, id, 'completed'),
    }))
  }
  //удаляем задачу (оставляем все задачи, кроме удаленной)
  onDeleted = (id) => {
    this.setState(({ tasks }) => ({
      tasks: tasks.filter((task) => task.id !== id),
    }))
  }
  //изменение задачи (начало)
  onEditStart = (id) => {
    this.setState((state) => {
      const tasks = state.tasks.map((task) => ({
        ...task,
        // меняем значение editing на true у задачи, которая меняется ( у которой task.id === id)
        editing: task.id === id,
      }))

      return {
        tasks,
      }
    })
  }
  //изменение задачи (конец)
  //.map конструирует новый массив, в state применять можно.
  onEditEnd = (value, id) => {
    this.setState((state) => {
      //конструируем новый массив
      const tasks = state.tasks.map((task) => {
        if (task.id !== id) {
          return task
        } else {
          return {
            ...task,
            editing: false,
            description: value,
          }
        }
      })

      return {
        tasks,
      }
    })
  }

  //создание задачи
  onTaskAdded = (label) => {
    this.setState((state) => ({ tasks: [this.createNewTask(label), ...state.tasks] }))
  }

  /*очистка завершенных задач (фильтруем массив, оставляем только !task.completed*/
  onClearСompleted = () => {
    this.setState((state) => ({
      tasks: state.tasks.filter((task) => !task.completed),
    }))
  }

  /*обработка кликов на кнопки-фильтры*/
  onFilter = (value) => {
    this.setState({ activefilter: value })
  }

  render() {
    //деструктурируем (извлекаем две константы из state: tasks и filters)
    const { tasks, activefilter } = this.state
    //отображение задач согласно выбранному фильтру
    const filteredTasks = this.getFilteredTasks()

    /*количество активных (невыполненных) дел*/
    const todoCount = tasks.filter((task) => !task.completed).length

    return (
      <section className="todoapp">
        <header className="header">
          <h1>ToDo</h1>
          <NewTaskForm onTaskAdded={this.onTaskAdded} />
        </header>
        <section className="main">
          <TaskList
            tasks={filteredTasks}
            onComplete={this.onComplete}
            /*удаление задачи*/
            onDeleted={this.onDeleted}
            /*изменение задачи начало*/
            onEditStart={this.onEditStart}
            /*изменение задачи конец*/
            onEditEnd={this.onEditEnd}
          />
        </section>
        <Footer
          /*количество активных дел*/
          todoCount={todoCount}
          /*обработка клика на кнопку-фильтр*/
          onFilter={this.onFilter}
          /*передаем значение кнопок-фильтров в Footer*/
          activefilter={activefilter}
          /*удаление активных задач*/
          onClearСompleted={this.onClearСompleted}
        />
      </section>
    )
  }
}
