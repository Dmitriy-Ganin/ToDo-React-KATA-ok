import { useState } from 'react'

import Footer from '../Footer'
import NewTaskForm from '../NewTaskForm'
import TaskList from '../TaskList'

import './App.css'

export default function App() {
  const [uniqId, setUniqId] = useState(0)
  const [tasks, setTasks] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')

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

  const toggleProperty = (arr, id, prop) => {
    const index = arr.findIndex((el) => el.id === id)
    const oldItem = arr[index]
    const newItem = { ...oldItem, [prop]: !oldItem[prop] }
    const before = arr.slice(0, index)
    const after = arr.slice(index + 1)
    return [...before, newItem, ...after]
  }

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case 'all':
        return tasks
      case 'active':
        return tasks.filter((task) => !task.completed)
      case 'completed':
        return tasks.filter((task) => task.completed)
      default:
        return tasks
    }
  }

  const onComplete = (id) => {
    setTasks((tasks) => {
      return toggleProperty(tasks, id, 'completed')
    })
  }

  const onDeleted = (id) => {
    pauseTimer(id)
    setTasks((tasks) => {
      return tasks.filter((task) => task.id !== id)
    })
  }

  const onEditStart = (id) => {
    setTasks((tasks) => {
      const editItems = tasks.map((item) => ({
        ...item,
        editing: item.id === id,
      }))

      return editItems
    })
  }

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

  const onTaskAdded = (label, min, sec) => {
    const newTask = createNewTask(label, min, sec)
    setTasks((tasks) => {
      return [...tasks, newTask]
    })
  }

  const onClearСompleted = () => {
    setTasks((tasks) => {
      return tasks.filter((task) => !task.completed)
    })
  }

  const onFilter = (value) => {
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

  const filteredTasks = getFilteredTasks()
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
          onDeleted={onDeleted}
          onEditStart={onEditStart}
          onEditEnd={onEditEnd}
          startTimer={startTimer}
          pauseTimer={pauseTimer}
        />
      </section>
      <Footer
        todoCount={todoCount}
        onFilter={onFilter}
        activeFilter={activeFilter}
        onClearСompleted={onClearСompleted}
      />
    </section>
  )
}
