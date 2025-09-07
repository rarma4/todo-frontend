import { useEffect, useState } from 'react'
import IconDelete from '../../assets/img/icon-delete.png'
import IconEdit from '../../assets/img/icon-edit.png'
import IconCheck from '../../assets/img/icon-check.png'
import IconDone from '../../assets/img/icon-done.png'
import './style.css'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import schemaTodo from "../../schemas/schemaTodo";
import api from '../../services/api'

function Home() {
  const [todos, setTodos] = useState([])
  const [editTodoId, setEditTodoId] = useState(null)
  const [completedTodos, setCompletedTodos] = useState(new Set())
  const [showModal, setShowModal] = useState(false)
  const [todoDelete, setTodoDelete] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaTodo),
  })

  async function getTodos() {
    const todosFromApi = await api.get('/todos')
    setTodos(todosFromApi.data)
  }

  const onSubmit = async (data) => {
    try {
      if (editTodoId) {
        // Modo edição
        await api.put(`/todos/${editTodoId}`, data);
        setEditTodoId(null);
      } else {
        // Modo criação
        await api.post("/todos", data);
      }
      getTodos();
      reset();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  async function confirmDelete() {
    if (todoDelete) {
      await api.delete(`/todos/${todoDelete}`)
      setShowModal(false)
      setTodoDelete(null)
      getTodos()
    }
  }

  function handleDeleteClick(id) {
    setTodoDelete(id)
    setShowModal(true)
  }

  function editTodo(todo) {
    setEditTodoId(todo.id)
    setValue("name", todo.name)
    setValue("description", todo.description)
  }

  function checkTodo(todo) {
    setCompletedTodos(prev => {
      const newSet = new Set(prev)
      if (newSet.has(todo.id)) {
        newSet.delete(todo.id)
      } else {
        newSet.add(todo.id)
      }
      return newSet
    })
  }

  useEffect(() => {
    getTodos()
  }, [])

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <h1 className='title'>
          {editTodoId ? 'Altere sua Tarefa' : 'Cadastre sua Tarefa'}
        </h1>
        <input
          type="text"
          placeholder="Digite a Tarefa*"
          {...register("name")}
        />
        {errors.name && (
          <span className="error-message">{errors.name?.message}</span>
        )}
        <input
          type="text"
          placeholder="Digite a descrição"
          {...register("description")}
        />
        {errors.description && (
          <span className="error-description">{errors.description?.message}</span>
        )}

        {editTodoId ? (
          <div className="btn-group">
            <input
              className="btn"
              type="submit"
              value={"Salvar Alterações"}
            />
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => {
                setEditTodoId(null);
                reset();
              }}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <input
            className="btn"
            type="submit"
            value={"Cadastrar"}
          />
        )}
      </form>

      {todos.map(todo => (
        <div key={todo.id} className='card'>
          <div>
          <p className={`${completedTodos.has(todo.id) ? 'done' : ''}`}>Tarefa: <span>{todo.name}</span></p>
            <p className={`${completedTodos.has(todo.id) ? 'done' : ''}`}>Descrição: <span>{todo.description}</span></p>
          </div>
          <div className='btn-actions'>
            <button
              onClick={() => checkTodo(todo)}
              className='btn-check'
            >
              <img
                src={completedTodos.has(todo.id) ? IconDone : IconCheck}
                alt={completedTodos.has(todo.id) ? "Done Icon" : "Check Icon"}
                width={30}
                height={30}
              />
            </button>
            <button
              onClick={() => editTodo(todo)}
              className='btn-edit'
            >
              <img
                src={IconEdit}
                alt="Edit Icon"
                width={30}
                height={30}
              />
            </button>
            <button
              onClick={() => handleDeleteClick(todo.id)}
              className='btn-delete'
            >
              <img
                src={IconDelete}
                alt="Delete Icon"
                width={30}
                height={30}
              />
            </button>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Tem certeza que deseja apagar essa tarefa?</h2>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn-confirm" onClick={confirmDelete}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
