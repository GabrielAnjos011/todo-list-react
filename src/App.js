import { useState, useEffect } from "react";
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createClient } from '@supabase/supabase-js'
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";
import "./App.css";


// const API = "http://localhost:5000";
const supabaseUrl = 'https://jgpiypbhvkheczuhcewj.supabase.co'
// const supabaseKey = process.env.SUPABASE_KEY
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncGl5cGJodmtoZWN6dWhjZXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTA1NDc0OTEsImV4cCI6MTk2NjEyMzQ5MX0.P4-BWd9-AgYdmqHBMWC7PDmMXahI40XZ_xiZCodMO60'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      //ROTA DO GET PARA USAR LOCAL
      // const res = await fetch(API + "/todos")
      //   .then((res) => res.json())
      //   .then((data) => data)
      //   .catch((err) => console.log(err));

      //ROTA GET USANDO O SUPABASE
      const { data: todos } = await supabase
        .from('todos')
        .select('*')

      setLoading(false);
      setTodos(todos);
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };
    //ROTA POST USANDO O SUPABASE
    await supabase
      .from('todos')
      .insert(todo)
    toast.success('Tarefa criada')
    //ROTA POST PARA USAR LOCAL
    // await fetch(API + "/todos", {
    //   method: "POST",
    //   body: JSON.stringify(todo),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    setTodos((prevState) => [...prevState, todo]);
    setTitle("");
    setTime("");
  };

  const handleDelete = async (id) => {
    //ROTA DELETE USANDO O SUPABASE
    await supabase
      .from('todos')
      .delete(id)
      .eq('id', id)
    toast.success('Deletado com sucesso')
    //ROTA DELETE PARA USAR LOCAL
    // await fetch(API + "/todos/" + id, {
    //   method: "DELETE",
    // });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
  };

  const handleEdit = async (todo) => {
    todo.done = !todo.done;
    //ROTA PUT USANDO O SUPABASE
    const data = await supabase
      .from('todos')
      .update(todo)
      .eq('id', todo.id)
    if (todo.done) {
      toast.success("Tarefa Concluida")
    }
    else {
      toast.success("Tarefa não Concluida")
    }
    //ROTA PUT PARA USAR LOCAL
    // const data = await fetch(API + "/todos/" + todo.id, {
    //   method: "PUT",
    //   body: JSON.stringify(todo),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    setTodos((prevState) =>
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
    );
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <div className="todo-header">
        <h1>Lista de Tarefa</h1>
      </div>
      <div className="form-todo">
        <h2>Insira a sua proxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input
              type="text"
              name="title"
              placeholder="Título da tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title ? title : ""}
              required
            />
            <div className="form-control">
              <label htmlFor="time">Duração:</label>
              <input
                type="number"
                name="time"
                placeholder="Tempo estimado (em horas)"
                onChange={(e) => setTime(e.target.value)}
                value={time ? time : ""}
                required
              />
            </div>
            <input className="btn-submit" type="submit" value="Criar tarefa" />
          </div>
        </form>
      </div>
      <div className="list-todo">
        <h2>Listas de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time === 1 ? todo.time+" hora" : todo.time+" horas"} </p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}
