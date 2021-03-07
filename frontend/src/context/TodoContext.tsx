import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from 'react-toastify'
import io from "socket.io-client";

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
  isUserPasswordAsked: boolean
  todos: Todo[]
  completedTodos: Todo[]
  pendingTodos: Todo[]
  toggleTodoID: string
  createTodo: (data: CreateTodoData) => Promise<void>
  toogleTodoStatus: (data: ToogleTodoData) => Promise<void>
  cancelAskPassword: () => void
  validateUserPassword: (password: string, todo_id: string) => Promise<void>
}

const TodoContext = createContext({} as TodoContextData)

interface TodoProviderProps {
  children: React.ReactNode
}

export  function TodoProvider({ children }: TodoProviderProps) {
  const [toggleID, setToggleID] = useState<string>('')
  const [askUserPassword, setAskUserPassword] = useState(false)
  const [todos, setTodos] = useState<Todo[]>(() => {
    const todos = localStorage.getItem('@saipos-todos')

    if (!todos) {
      return []
    }

    return JSON.parse(todos)
  })
  
  useEffect(() => {
    console.log(process.env.REACT_APP_API_URL)
    fetch(`${process.env.REACT_APP_API_URL}/api/todos`).then(response => response.json()).then(todos => {
      localStorage.setItem('@saipos-todos', JSON.stringify(todos))
      setTodos(todos)
    })

    const socket = io(`${process.env.REACT_APP_API_URL}`)

    socket.on("todo_created", (todo_created: Todo) => {
      setTodos(state => [todo_created, ...state])
    });

    socket.on("todo_updated", (todo_updated: Todo) => {
      setTodos(state => state.map(item => item.id === todo_updated.id ? todo_updated : item))
    });    
  }, [])

  const createTodo = useCallback(async (data: CreateTodoData) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/todos`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'          
        },
        body: JSON.stringify(data)
      }).then(response => response.json())
      
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

  const toogleTodoStatus = useCallback(async ({ id }: ToogleTodoData) => {
    const todoIndex = todos.findIndex(t => t.id === id)

    if (todoIndex < 0) {
      return;
    }

    if (todos[todoIndex].completed) {
      setToggleID(id)
      setAskUserPassword(true)
    } else {
      await updateTodoStatus(id, !todos[todoIndex].completed )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos])

  const validateUserPassword = useCallback(async (password: string, todo_id: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/validate`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'          
        },
        body: JSON.stringify({ password, todo_id })
      }).then(response => response.json())
      
      if (response.error) {
        toast.error('Senha informada não é válida. Tente novamente', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      if (response.ok) {
        const todoIndex = todos.findIndex(t => t.id === response.todo_id)

        if (todoIndex < 0) {
          return;
        }        

        setAskUserPassword(false)
        await updateTodoStatus(todos[todoIndex].id, !todos[todoIndex].completed )
        setToggleID('')
      }

    } catch (error) {
      console.log(error.response)

      toast.error('Ocorreu um erro ao validar a senha. Tente novamente', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });    
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos])

  const cancelAskPassword = useCallback(() => setAskUserPassword(false), [])

  const updateTodoStatus = useCallback(async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'          
        },
        body: JSON.stringify({ completed })
      }).then(response => response.json())

      if (response.error) {
        toast.error(response.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });        
        return;
      }
      
      toast.success('Tarefa atualizada com sucesso', {
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

      toast.error('Ocorreu um erro ao atualizar tarefa. Tente novamente', {
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

  const completedTodos = useMemo(() => todos.filter(todo => todo.completed), [todos])
  const pendingTodos  = useMemo(() => todos.filter(todo => !todo.completed), [todos])

  return (
    <TodoContext.Provider value={{ 
      isUserPasswordAsked: askUserPassword,
      todos, 
      completedTodos, 
      pendingTodos,
      toggleTodoID: toggleID, 
      createTodo, 
      toogleTodoStatus, 
      cancelAskPassword,
      validateUserPassword
    }}>
      {children}
    </TodoContext.Provider>
  )
}

export const useTodo = () => useContext(TodoContext)