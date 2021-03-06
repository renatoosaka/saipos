import { TodoProvider } from './TodoContext'

interface ApplicationProviderProps {
  children: React.ReactNode
}

export function ApplicationProvider({ children }: ApplicationProviderProps) {
  return (
    <TodoProvider>
      {children}
    </TodoProvider>
  )
}