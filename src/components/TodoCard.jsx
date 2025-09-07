import { memo } from 'react'
import IconDelete from '../assets/img/icon-delete.png'
import IconEdit from '../assets/img/icon-edit.png'
import IconCheck from '../assets/img/icon-check.png'
import IconDone from '../assets/img/icon-done.png'
import { ICON_SIZE } from '../constants'

const TodoCard = memo(({ 
  todo, 
  isCompleted, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className='card'>
      <div>
        <p className={isCompleted ? 'done' : ''}>
          Tarefa: <span>{todo.name}</span>
        </p>
        <p className={isCompleted ? 'done' : ''}>
          Descrição: <span>{todo.description}</span>
        </p>
      </div>
      <div className='btn-actions'>
        <button
          onClick={() => onToggleComplete(todo)}
          className='btn-check'
          aria-label={isCompleted ? 'Desmarcar tarefa' : 'Marcar tarefa como concluída'}
        >
          <img
            src={isCompleted ? IconDone : IconCheck}
            alt={isCompleted ? "Tarefa concluída" : "Marcar como concluída"}
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        </button>
        <button
          onClick={() => onEdit(todo)}
          className='btn-edit'
          aria-label="Editar tarefa"
        >
          <img
            src={IconEdit}
            alt="Editar tarefa"
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className='btn-delete'
          aria-label="Excluir tarefa"
        >
          <img
            src={IconDelete}
            alt="Excluir tarefa"
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        </button>
      </div>
    </div>
  )
})

TodoCard.displayName = 'TodoCard'

export default TodoCard
