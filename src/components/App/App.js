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
    isTimerOn: false,
  }
  //создание задачи
  createNewTask = (label, min, sec) => ({
    description: label,
    createTime: new Date(),
    completed: false,
    editing: false,
    id: this.maxId++,
    minutes: min,
    seconds: sec,
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
    const { activeFilter, tasks } = this.state
    console.log(activeFilter)
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
  onTaskAdded = (label, min, sec) => {
    this.setState((state) => ({ tasks: [this.createNewTask(label, min, sec), ...state.tasks] }))
  }

  /*очистка завершенных задач (фильтруем массив, оставляем только !task.completed*/
  onClearСompleted = () => {
    this.setState((state) => ({
      tasks: state.tasks.filter((task) => !task.completed),
    }))
  }

  /*обработка кликов на кнопки-фильтры*/
  onFilter = (value) => {
    this.setState({ activeFilter: value })
  }

  startTimer = (id) => {
    if (!this.state.isTimerOn) {
      this.timer = setInterval(() => {
        this.setState(({ tasks }) => {
          const idx = tasks.findIndex((elem) => elem.id === id)
          const oldItem = tasks[idx]
          let newItem = { ...oldItem, seconds: oldItem.seconds - 1 }
          if (newItem.seconds < 0) {
            newItem = { ...newItem, minutes: oldItem.minutes - 1, seconds: 59 }
          }
          if (newItem.seconds === 0 && newItem.minutes === 0) {
            clearInterval(this.timer)
            this.setState({ isTimerOn: false })
          }
          const newArr = [...tasks.slice(0, idx), newItem, ...tasks.slice(idx + 1)]
          return {
            tasks: newArr,
            isTimerOn: true,
          }
        })
      }, 1000)
    }
  }

  pauseTimer = () => {
    clearInterval(this.timer)
    this.setState({ isTimerOn: false })
  }

  render() {
    //деструктурируем (извлекаем две константы из state: tasks и filters)
    const { tasks, activeFilter } = this.state
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
            startTimer={this.startTimer}
            pauseTimer={this.pauseTimer}
          />
        </section>
        <Footer
          /*количество активных дел*/
          todoCount={todoCount}
          /*обработка клика на кнопку-фильтр*/
          onFilter={this.onFilter}
          /*передаем значение кнопок-фильтров в Footer*/
          activeFilter={activeFilter}
          /*удаление активных задач*/
          onClearСompleted={this.onClearСompleted}
        />
      </section>
    )
  }
}
