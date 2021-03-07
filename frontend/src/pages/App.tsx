import React from 'react'

import { Modal, useModal } from "../components/Modal"
import { Form } from "../components/Form"
import { Password } from "../components/Password"
import { TodoList } from "../components/TodoList"
import { useTodo } from "../context/TodoContext"

import styles from '../styles/Home.module.css'

function App() {
  const { toggle } = useModal()
  const { pendingTodos, completedTodos, isUserPasswordAsked, randomTodo } = useTodo()

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Tarefas</h1>

      <Form />

      <button onClick={() => randomTodo()} className={styles.noTasks}>Estou sem tarefas</button>

      <div className={styles.todoContainer}>
        <TodoList title='Pendentes' acceptDrop='completed' todos={pendingTodos} />
        <TodoList title='Finalizadas' acceptDrop='pending' todos={completedTodos} />
      </div>

      <Modal isShowing={isUserPasswordAsked} toggle={toggle}>
        <Password />
      </Modal>
    </div>
  );
}

export default App;
