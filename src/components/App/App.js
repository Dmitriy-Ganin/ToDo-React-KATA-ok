import { useState } from 'react'

import Footer from '../Footer'
import NewTaskForm from '../NewTaskForm'
import TaskList from '../TaskList'

import './App.css'

export default function App() {
  //let maxId = 0
  const [uniqId, setUniqId] = useState(0)
  const [tasks, setTasks] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')

  //создание задачи
  const createNewTask = (label, min, sec) => {
    setUniqId(uniqId + 1)
    return {
      description: label,
      createTime: new Date(),
      completed: false,
      editing: false,
      id: uniqId,
      minutes: min,
      seconds: sec,
      timerId: null,
      isTimerOn: false,
    }
  }

  //Изменение статуса задачи
  //onTaskClick
  const toggleProperty = (arr, id, prop) => {
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
  //const filter&&onFilterChange
  const getFilteredTasks = () => {
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
  //убрать,toggleProperty = onComplete
  const onComplete = (id) => {
    setTasks((tasks) => {
      return toggleProperty(tasks, id, 'completed')
    })
  }

  //удаляем задачу (оставляем все задачи, кроме удаленной)
  //onTaskDelete
  const onDeleted = (id) => {
    //задача удаляется - останавливаем таймер
    pauseTimer(id)
    setTasks((tasks) => {
      return tasks.filter((task) => task.id !== id)
    })
  }
  //изменение задачи (начало)
  const onEditStart = (id) => {
    setTasks((tasks) => {
      const editItems = tasks.map((item) => ({
        ...item,
        editing: item.id === id,
      }))

      return editItems
    })
  }
  //изменение задачи (конец)
  //.map конструирует новый массив, в state применять можно.
  const onEditEnd = (value, id) => {
    setTasks((tasks) => {
      const editItems = tasks.map((item) => {
        if (item.id !== id) {
          return item
        } else {
          return { ...item, editing: false, description: value }
        }
      })

      return editItems
    })
  }

  //создание задачи
  const onTaskAdded = (label, min, sec) => {
    const newTask = createNewTask(label, min, sec)
    setTasks((tasks) => {
      return [...tasks, newTask]
    })
  }

  /*очистка завершенных задач (фильтруем массив, оставляем только !task.completed*/
  const onClearСompleted = () => {
    setTasks((tasks) => {
      return tasks.filter((task) => !task.completed)
    })
  }

  /*обработка кликов на кнопки-фильтры*/
  const onFilter = (value) => {
    //console.log(value)
    setActiveFilter(value)
  }

  const pauseTimer = (id) => {
    const { isTimerOn } = tasks.find((el) => el.id === id)
    if (isTimerOn) {
      const { timerId } = tasks.find((el) => el.id === id)
      setTasks((prevData) => {
        const idx = prevData.findIndex((el) => el.id === id)
        const data = [...prevData]
        data[idx].isTimerOn = false

        return data
      })
      clearInterval(timerId)
    }
  }

  const startTimer = (id) => {
    const { isTimerOn } = tasks.find((el) => el.id === id)

    if (!isTimerOn) {
      const timerId = setInterval(() => {
        setTasks((prevData) => {
          const updateTodo = prevData.map((todoItem) => {
            if (todoItem.id === id) {
              if (todoItem.seconds === 0 && todoItem.minutes === 0) {
                pauseTimer(id)
              }
              let sec = todoItem.seconds - 1
              let min = todoItem.minutes
              if (min > 0 && sec < 0) {
                min -= 1
                sec = 59
              }
              if (min === 0 && sec < 0) {
                sec = 0
                pauseTimer(id)
              }

              return {
                ...todoItem,
                seconds: sec,
                minutes: min,
              }
            }

            return todoItem
          })

          return updateTodo
        })
      }, 1000)
      setTasks((prevData) => {
        const idx = prevData.findIndex((el) => el.id === id)
        const data = [...prevData]
        data[idx].timerId = timerId
        data[idx].isTimerOn = true

        return data
      })
    }
  }

  //деструктурируем (извлекаем две константы из state: tasks и filters)
  //отображение задач согласно выбранному фильтру
  const filteredTasks = getFilteredTasks()

  /*количество активных (невыполненных) дел*/
  const todoCount = tasks.filter((task) => !task.completed).length

  return (
    <section className="todoapp">
      <header className="header">
        <h1>ToDo</h1>
        <NewTaskForm onTaskAdded={onTaskAdded} />
      </header>
      <section className="main">
        <TaskList
          tasks={filteredTasks}
          onComplete={onComplete}
          /*удаление задачи*/
          onDeleted={onDeleted}
          /*изменение задачи начало*/
          onEditStart={onEditStart}
          /*изменение задачи конец*/
          onEditEnd={onEditEnd}
          startTimer={startTimer}
          pauseTimer={pauseTimer}
        />
      </section>
      <Footer
        /*количество активных дел*/
        todoCount={todoCount}
        /*обработка клика на кнопку-фильтр*/
        onFilter={onFilter}
        /*передаем значение кнопок-фильтров в Footer*/
        activeFilter={activeFilter}
        /*удаление активных задач*/
        onClearСompleted={onClearСompleted}
      />
    </section>
  )
}
