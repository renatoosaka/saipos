import { useDrag } from 'react-dnd'
import { useTodo } from '../context/TodoContext'
import styles from '../styles/components/Todo.module.css'
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

interface TodoProps {
  todo: Todo
}

export function TodoContainer({ todo }: TodoProps ) {
  const { toogleTodoStatus } = useTodo()

  const [{ isDragging }, drag] = useDrag({
    item: { type: todo.completed ? 'completed' : 'pending', id: todo.id, completed: todo.completed },
    end: (item) => {
      toogleTodoStatus({
        type: item?.type ?? '',
        id: item?.id ?? ''
      })
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  })

  return (
    <div ref={drag} className={`${styles.container} ${todo.completed && styles.completed} ${isDragging && styles.dragging}`}>
      <p className={styles.title}>{todo.description}</p>
      <div className={styles.userContainer}> 
        <small>{todo.user.name}</small>
        <small>{todo.user.email}</small>
      </div>
    </div>
  );
}
