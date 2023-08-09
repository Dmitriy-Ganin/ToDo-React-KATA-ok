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
    minutes: '',
    seconds: '',
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
    timerId: null,
    isTimerOn: false,
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
    //console.log(activeFilter)
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
    const { isTimerOn } = this.state.tasks.find((el) => el.id === id)

    if (!isTimerOn) {
      const timerId = setInterval(() => {
        this.setState((prevState) => {
          const updateTodo = prevState.tasks.map((todoItem) => {
            if (todoItem.id === id) {
              if (todoItem.seconds === 0 && todoItem.minutes === 0) {
                this.pauseTimer(id)
              }
              let sec = todoItem.seconds - 1
              let min = todoItem.minutes
              if (min > 0 && sec === 0) {
                min -= 1
                sec = 59
              }
              if (sec === 0 || sec < 0) {
                sec = 0
                this.pauseTimer(id)
              }

              return {
                ...todoItem,
                seconds: sec,
                minutes: min,
              }
            }

            return todoItem
          })

          return {
            tasks: updateTodo,
          }
        })
      }, 1000)
      this.setState(({ tasks }) => {
        const idx = tasks.findIndex((el) => el.id === id)
        const data = [...tasks]
        data[idx].timerId = timerId
        data[idx].isTimerOn = true

        return {
          tasks: data,
        }
      })
    }
  }

  pauseTimer = (id) => {
    //console.log(this.state.tasks.find((el) => el.id === id))
    const { timerId } = this.state.tasks.find((el) => el.id === id)
    this.setState(({ tasks }) => {
      const idx = tasks.findIndex((el) => el.id === id)
      const data = [...tasks]
      data[idx].isTimerOn = false

      return {
        tasks: data,
      }
    })
    clearInterval(timerId)
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
