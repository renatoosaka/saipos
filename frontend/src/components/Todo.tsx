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

export function Todo({ todo }: TodoProps ) {
  return (
    <div className={`${styles.container} ${todo.completed && styles.completed}`}>
      <p className={styles.title}>{todo.description}</p>
      <div className={styles.userContainer}> 
        <small>{todo.user.name}</small>
        <small>{todo.user.email}</small>
      </div>
    </div>
  );
}
