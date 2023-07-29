import { Component } from 'react'

import Footer from '../Footer'
import NewTaskForm from '../NewTaskForm'
import TaskList from '../TaskList'

import './App.css'

export default class App extends Component {
  maxId = 0

  state = {
    tasks: [],
    activeFilter: 'all', //фильтр по умолчанию
    //набор фильтров-кнопок (param - key)
    filters: [
      { label: 'All', param: 'all', active: true },
      { label: 'Active', param: 'active', active: false },
      { label: 'Completed', param: 'completed', active: false },
    ],
  }
  //создание задачи
  createTask = (label) => ({
    description: label,
    createTime: new Date(),
    completed: false,
    editing: false,
    id: this.maxId++,
  })

  //добавление задачи
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
    const { activeFilter, tasks } = this.state
    switch (activeFilter) {
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

  completeTaskHandler = (id) => {
    this.setState((state) => ({
      tasks: this.toggleProperty(state.tasks, id, 'completed'),
    }))
  }
  //удаляем задачу (оставляем все задачи, кроме удаленной)
  deleteTaskHandler = (id) => {
    this.setState(() => ({
      tasks: this.state.tasks.filter((task) => task.id !== id),
    }))
  }
  //изменение задачи (начало)
  editStartTaskHandler = (id) => {
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
  editEndTaskHandler = (value, id) => {
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

  onTaskCreate = (label) => {
    this.setState((state) => ({ tasks: [this.createTask(label), ...state.tasks] }))
  }

  /*очистка завершенных задач (фильтруем массив, оставляем только !task.completed*/
  onClearСompleted = () => {
    this.setState((state) => ({
      tasks: state.tasks.filter((task) => !task.completed),
    }))
  }

  /*обработка кликов на кнопки-фильтры*/
  filterHandler = (param) => {
    this.setState((state) => {
      const filters = state.filters.map((filter) => ({
        ...filter,
        //формируем активный фильтр
        active: filter.param === param,
      }))

      return {
        filters,
        //активный фильтр
        activeFilter: param,
      }
    })
  }

  render() {
    //деструктурируем (извлекаем две константы из state: tasks и filters)
    const { tasks, filters } = this.state
    //отображение задач согласно выбранному фильтру
    const filteredTasks = this.getFilteredTasks()

    /*количество активных (невыполненных) дел*/
    const todoCount = tasks.filter((task) => !task.completed).length

    return (
      <section className="todoapp">
        <header className="header">
          <h1>ToDo</h1>
          <NewTaskForm onTaskCreate={this.onTaskCreate} />
        </header>
        <section className="main">
          <TaskList
            tasks={filteredTasks}
            onComplete={this.completeTaskHandler}
            /*удаление задачи*/
            onDeleted={this.deleteTaskHandler}
            /*изменение задачи начало*/
            onEditStart={this.editStartTaskHandler}
            /*изменение задачи конец*/
            onEditEnd={this.editEndTaskHandler}
          />
        </section>
        <Footer
          /*количество активных дел*/
          todoCount={todoCount}
          /*обработка клика на кнопку-фильтр*/
          onFilter={this.filterHandler}
          /*передаем значение кнопок-фильтров в Footer*/
          filters={filters}
          /*удаление активных задач*/
          onClearСompleted={this.onClearСompleted}
        />
      </section>
    )
  }
}
