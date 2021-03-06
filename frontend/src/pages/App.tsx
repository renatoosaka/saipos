import React from 'react';
import { Form } from "../components/Form";
import { TodoList } from "../components/TodoList";
import { useTodo } from "../context/TodoContext";

import styles from '../styles/Home.module.css'

function App() {
  const { pendingTodos, completedTodos } = useTodo()

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Tarefas</h1>

      <Form />

      <div className={styles.todoContainer}>
        <TodoList title='Pendentes' acceptDrop='completed' todos={pendingTodos} />
        <TodoList title='Finalizadas' acceptDrop='pending' todos={completedTodos} />
      </div>
    </div>
  );
}

export default App;
