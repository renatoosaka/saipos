import { createContext, useCallback, useContext, useState } from "react";
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

interface TodoContextData {
  completedTodos: Todo[]
  pendingTodos: Todo[]
  createTodo: (data: CreateTodoData) => Promise<void>
}

const TodoContext = createContext({} as TodoContextData)

export const TodoProvider = ({ children }) => {
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([])
  const [pendingTodos, setPendingTodos] = useState<Todo[]>([])
  
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

      setPendingTodos(state => [...state, response])
      // setPendingTodos([...pendingTodos, response])
      
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

  return (
    <TodoContext.Provider value={{ completedTodos, pendingTodos, createTodo }}>
      {children}
    </TodoContext.Provider>
  )
}

export const useTodo = () => useContext(TodoContext)