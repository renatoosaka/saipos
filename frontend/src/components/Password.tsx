import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useTodo } from '../context/TodoContext';

import styles from '../styles/components/Password.module.css'

interface FormData {
  password: string;
}

export function Password() {
  const { toggleTodoID, cancelAskPassword, validateUserPassword } = useTodo()
  const { register, errors, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = useCallback(async (data: FormData) => {
    await validateUserPassword(data.password, toggleTodoID)
    reset()
  }, [validateUserPassword, toggleTodoID, reset]);

  return (
    <>
      <h1 className={styles.title}>Informe a senha de liberação</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
        <input name="password" id="password" type="password" placeholder="Senha" autoFocus ref={register({ required: true })} />
        {errors.password && (<span>Senha não foi informada</span>)}

        <footer>
          <button type="button" onClick={() => { reset(); cancelAskPassword(); }}>Cancelar</button>
          <button type="submit">Enviar</button>
        </footer>      
      </form>
    </>
  )
}