import { TodoProvider } from './TodoContext'

export const ApplicationProvider = ({ children }) => {
  return (
    <TodoProvider>
      {children}
    </TodoProvider>
  )
}