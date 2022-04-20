import './App.css';

import { useState, useEffect} from 'react'
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs'

const API = "http://localhost:5000"

function App() {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false
    }

    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    })

    setTitle("")
    setTime("")
  }

  return (
    <div className="App">
      <div className='todo-header'>
        <h1>React Todo</h1>
      </div>
      <div className='form-todo'>
        <h2>Insira a sua proxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input 
              type="text" 
              name='title' 
              placeholder='Título da tarefa' 
              onChange={(e) => setTitle(e.target.value)} 
              value={title ? title : ''}
              required
            />
          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input 
              type="text" 
              name='time' 
              placeholder='Tempo estimado (em horas)' 
              onChange={(e) => setTime(e.target.value)} 
              value={time ? time : ''}
              required
            />
          </div>
            <input type="submit" value="Criar tarefa" />
          </div>
        </form>
      </div>
      <div className='list-todo'>
        <h2>Listas de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas</p>}
      </div>
    </div>
  );
}

export default App;
