import { useState, useCallback } from 'react'
import api from '../services/api'
import { ERROR_MESSAGES } from '../constants'

export const useTodos = () => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/todos')
      setTodos(response.data)
    } catch (err) {
      setError(ERROR_MESSAGES.FETCH_TODOS)
      console.error('Erro ao buscar todos:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createTodo = useCallback(async (todoData) => {
    try {
      setError(null)
      await api.post('/todos', todoData)
      await fetchTodos()
    } catch (err) {
      setError(ERROR_MESSAGES.CREATE_TODO)
      console.error('Erro ao criar todo:', err)
      throw err
    }
  }, [fetchTodos])

  const updateTodo = useCallback(async (id, todoData) => {
    try {
      setError(null)
      await api.put(`/todos/${id}`, todoData)
      await fetchTodos()
    } catch (err) {
      setError(ERROR_MESSAGES.UPDATE_TODO)
      console.error('Erro ao atualizar todo:', err)
      throw err
    }
  }, [fetchTodos])

  const deleteTodo = useCallback(async (id) => {
    try {
      setError(null)
      await api.delete(`/todos/${id}`)
      await fetchTodos()
    } catch (err) {
      setError(ERROR_MESSAGES.DELETE_TODO)
      console.error('Erro ao excluir todo:', err)
      throw err
    }
  }, [fetchTodos])

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo
  }
}
