import { Header } from './components/Header'
import { Tabs } from './components/Tabs'
import { TodoList } from './components/TodoList'
import { TodoInput } from './components/TodoInput'

import { useState, useEffect } from 'react'



function App() {

  // const todos = [
  //   {input: 'Hello! Add a todo', complete: true},
  //   {input: 'Buy groceries', complete: false},
  //   {input: 'Learn React', complete: false},
  //   {input: 'Learn CSS', complete: true},
  // ]
  const [todos, setTodos] = useState([]);
  const [selectedTab, setSelectedTab] = useState('All');

  function addTodo(newTodo) {
    const newTodoList = [...todos, {input: newTodo, complete: false}]
    setTodos(newTodoList)
    handleSaveData(newTodoList)
  }

  function deleteTodo(index) {
    let newTodoList = todos.filter((val, valIndex) => {
      return valIndex !== index
    })
    setTodos(newTodoList)
    handleSaveData(newTodoList)
  }

  function editTodo(index) {
    let newTodoList = [...todos]
    let completedTodo = todos[index]
    completedTodo['complete'] = true
    newTodoList[index] = completedTodo
    setTodos(newTodoList)
    handleSaveData(newTodoList)
  }

  function handleSaveData(currentTodos) {
    localStorage.setItem('todo-app', JSON.stringify({ todos: currentTodos }))
  }

  useEffect(() => {
    if(!localStorage || !localStorage.getItem('todo-app')) {
      return
    }
    let db = []
    db = JSON.parse(localStorage.getItem('todo-app'))
    setTodos(db.todos)
    
  }, [])

  return (
    // These empty tags are called fragments
    <> 
      <Header todos={todos}/>
      <Tabs todos={todos} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <TodoList todos={todos} selectedTab={selectedTab} deleteTodo={deleteTodo} editTodo={editTodo}/>
      <TodoInput addTodo={addTodo}/>
    </>
  )
}

export default App
