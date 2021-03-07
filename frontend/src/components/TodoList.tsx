import { useDrop } from 'react-dnd'
import { TodoContainer } from './Todo'

import styles from '../styles/components/TodoList.module.css'
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

interface TodoListProps {
  title: string
  todos: Todo[]
  acceptDrop: string
}
export function TodoList({ title, todos, acceptDrop }: TodoListProps) {
  const [{ isOver }, drop] = useDrop({
    accept: acceptDrop,
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })    
  })

  return (
    <div className={`${styles.container} ${isOver && styles.dropOver}`} ref={drop}>
      <p className={styles.title}>{title}</p>
      <div className={`${styles.listContainer} ${styles[acceptDrop]}`}>
        {todos.map(todo => <TodoContainer key={todo.id} todo={todo}/>)}      
      </div>
    </div>
  )
}