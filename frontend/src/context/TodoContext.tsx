import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from 'react-toastify'

interface User {
  id: string;
  name: string;
  email: string;
}

interface Todo {
  id: string;
  description: string;
  completed: boolean;
  user: User;
}

interface CreateTodoData {
  name: string;
  email: string;
  description: string;  
}

interface ToogleTodoData {
  id: string
  type: string
}
interface TodoContextData {
  todos: Todo[]
  completedTodos: Todo[]
  pendingTodos: Todo[]
  createTodo: (data: CreateTodoData) => Promise<void>
  toogleTodoStatus: (data: ToogleTodoData) => Promise<void>
}

const TodoContext = createContext({} as TodoContextData)

interface TodoProviderProps {
  children: React.ReactNode
}

export  function TodoProvider({ children }: TodoProviderProps) {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const todos = localStorage.getItem('@saipos-todos')

    if (!todos) {
      return []
    }

    return JSON.parse(todos)
  })
  
  useEffect(() => {
    fetch(`http://localhost:5000/api/todos`).then(response => response.json()).then(todos => {
      localStorage.setItem('@saipos-todos', JSON.stringify(todos))
      setTodos(todos)
    })
  }, [])

  const createTodo = useCallback(async (data: CreateTodoData) => {
    try {
      const response = await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'          
        },
        body: JSON.stringify(data)
      }).then(response => response.json())

      setTodos(state => [...state, response])
      
      toast.success('Nova tarefa cadastrada com sucesso', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })      
    } catch (error) {
      console.log(error)

      toast.error('Ocorreu um erro ao cadastrar nova tarefa. Tente novamente', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });            
    }
  }, [])

  const toogleTodoStatus = useCallback(async ({ id, type }: ToogleTodoData) => {
    setTodos(todos.map(item => item.id === id ? {...item, completed: !item.completed} : item))
  }, [todos])

  const completedTodos = useMemo(() => todos.filter(todo => todo.completed), [todos])
  const pendingTodos  = useMemo(() => todos.filter(todo => !todo.completed), [todos])

  return (
    <TodoContext.Provider value={{ todos, completedTodos, pendingTodos, createTodo, toogleTodoStatus }}>
      {children}
    </TodoContext.Provider>
  )
}

export const useTodo = () => useContext(TodoContext)