import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTodo } from '../context/TodoContext';
import styles from '../styles/components/Form.module.css'

interface FormData {
  name: string;
  email: string;
  description: string;
}

export function Form() {
  const [emailSuggestion, setEmailSuggestion] = useState()

  const { createTodo } = useTodo()
  const { register, errors, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = useCallback(async (data: FormData) => {
    await createTodo(data)
    reset()
  }, [createTodo, reset]);

  const validateEmail = useCallback(async (value: string) => {
    try {       
      const response = await fetch(`http://apilayer.net/api/check?access_key=${process.env.REACT_APP_MAIL_CHEK_KEY}&email=${value}`).then(response => response.json())
      
      setEmailSuggestion(response.did_you_mean)

      return response.did_you_mean === "";
    } catch (error) {
      return false;      
    }

  }, [])

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="description">Tarefa</label>
      <input name="description" id="description" type="text" placeholder="Descrição" autoFocus ref={register({ required: true })} />
      {errors.description && (<span>Tarefa não foi informada</span>)}

      <label htmlFor="name">Responsável</label>
      <input name="name" id="name" type="text" placeholder="Nome" ref={register({ required: true })} />
      {errors.name && (<span>Nome não foi informado</span>)}

      <label htmlFor="email">E-mail</label>
      <input name="email" id="email" type="email" placeholder="E-mail" ref={register({ required: true, validate: ({ asyncValidate: validateEmail }) })} />
      {errors.email && emailSuggestion === '' && (<span>E-mail não foi informado</span>)}
      {errors.email && emailSuggestion !== '' && (<span>Você quis dizer {emailSuggestion}?</span>)}

      <footer>
        <button type="button" onClick={() => reset()}>Cancelar</button>
        <button type="submit">Salvar</button>
      </footer>
    </form>
  )
}