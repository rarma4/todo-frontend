import { useEffect, useState, useCallback } from 'react'
import './style.css'
import TodoForm from '../../components/TodoForm'
import TodoCard from '../../components/TodoCard'
import ConfirmationModal from '../../components/ConfirmationModal'
import { useTodos } from '../../hooks/useTodos'
import { LOADING_MESSAGES } from '../../constants'

function Home() {
  const [editTodoId, setEditTodoId] = useState(null)
  const [completedTodos, setCompletedTodos] = useState(new Set())
  const [showModal, setShowModal] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState(null)

  const {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo
  } = useTodos()

  const handleSubmit = useCallback(async (data) => {
    try {
      if (editTodoId) {
        await updateTodo(editTodoId, data)
        setEditTodoId(null)
      } else {
        await createTodo(data)
      }
    } catch (error) {
      console.error("Erro ao salvar:", error)
    }
  }, [editTodoId, updateTodo, createTodo])

  const handleConfirmDelete = useCallback(async () => {
    if (todoToDelete) {
      try {
        await deleteTodo(todoToDelete)
        setShowModal(false)
        setTodoToDelete(null)
      } catch (error) {
        console.error("Erro ao excluir:", error)
      }
    }
  }, [todoToDelete, deleteTodo])

  const handleDeleteClick = useCallback((id) => {
    setTodoToDelete(id)
    setShowModal(true)
  }, [])

  const handleEditTodo = useCallback((todo) => {
    setEditTodoId(todo.id)
  }, [])

  const handleToggleComplete = useCallback((todo) => {
    setCompletedTodos(prev => {
      const newSet = new Set(prev)
      if (newSet.has(todo.id)) {
        newSet.delete(todo.id)
      } else {
        newSet.add(todo.id)
      }
      return newSet
    })
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditTodoId(null)
  }, [])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const editingTodo = todos.find(todo => todo.id === editTodoId)

  if (loading) {
    return (
      <div className='container'>
        <div style={{ color: '#fff', textAlign: 'center' }}>
          {LOADING_MESSAGES.FETCHING}
        </div>
      </div>
    )
  }

  return (
    <div className='container'>
      {error && (
        <div style={{ color: '#ff6868', textAlign: 'center', marginBottom: '20px' }}>
          {error}
        </div>
      )}
      
      <TodoForm
        isEditing={!!editTodoId}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
        defaultValues={editingTodo}
      />

      {todos.map(todo => (
        <TodoCard
          key={todo.id}
          todo={todo}
          isCompleted={completedTodos.has(todo.id)}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTodo}
          onDelete={handleDeleteClick}
        />
      ))}

      <ConfirmationModal
        isOpen={showModal}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  )
}

export default Home
