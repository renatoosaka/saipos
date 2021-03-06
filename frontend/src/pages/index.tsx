import { GetServerSideProps } from "next"
import { Form } from "../components/Form";
import { Todo } from '../components/Todo'
import { useTodo } from "../context/TodoContext";

import styles from '../styles/Home.module.css';

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

interface HomeProps {
  completedTodos: Todo[]
  pendingTodos: Todo[]
}

export default function Home({ completedTodos, pendingTodos } : HomeProps ) {
  const { pendingTodos: contextPendingTodos, completedTodos: contextCompletedTodos } = useTodo()

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Tarefas</h1>

      <Form />

      <div className={styles.todoContainer}>        
        <div className={styles.todoColumn}>
          <p className={styles.todoContainerTile}>Pendentes</p>
          {[...contextPendingTodos, ...pendingTodos].map(todo => <Todo key={todo.id} todo={todo}/>)}
        </div>
        <div className={styles.todoColumn}>
          <p className={styles.todoContainerTile}>Finalizadas</p>
          {[...contextCompletedTodos, ...completedTodos].map(todo => <Todo key={todo.id} todo={todo}/>)}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const todos = await fetch(`http://localhost:5000/api/todos`).then(response => response.json())
  const pendingTodos = todos.filter(todo => !todo.completed)
  const completedTodos = todos.filter(todo => todo.completed)
    
  return {
    props: {
      pendingTodos,
      completedTodos
    }
  }
}