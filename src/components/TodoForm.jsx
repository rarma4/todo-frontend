 import { memo, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import schemaTodo from "../schemas/schemaTodo"
import { FORM_TEXTS } from '../constants'

const TodoForm = memo(({ 
  isEditing, 
  onSubmit, 
  onCancel, 
  defaultValues = {} 
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaTodo),
    defaultValues
  })

  // Atualiza os valores do formulário quando defaultValues muda (modo edição)
  useEffect(() => {
    if (isEditing && defaultValues && defaultValues.name) {
      setValue("name", defaultValues.name)
      setValue("description", defaultValues.description || "")
    }
  }, [isEditing, defaultValues, setValue])

  const handleFormSubmit = async (data) => {
    await onSubmit(data)
    reset()
  }

  const handleCancel = () => {
    onCancel()
    reset()
  }

  return (
    <form className='form' onSubmit={handleSubmit(handleFormSubmit)}>
      <h1 className='title'>
        {isEditing ? FORM_TEXTS.TITLE_EDIT : FORM_TEXTS.TITLE_CREATE}
      </h1>
      
      <input
        type="text"
        placeholder={FORM_TEXTS.PLACEHOLDER_NAME}
        {...register("name")}
        aria-invalid={errors.name ? "true" : "false"}
      />
      {errors.name && (
        <span className="error-message" role="alert">
          {errors.name?.message}
        </span>
      )}
      
      <input
        type="text"
        placeholder={FORM_TEXTS.PLACEHOLDER_DESCRIPTION}
        {...register("description")}
        aria-invalid={errors.description ? "true" : "false"}
      />
      {errors.description && (
        <span className="error-description" role="alert">
          {errors.description?.message}
        </span>
      )}

      {isEditing ? (
        <div className="btn-group">
          <input
            className="btn"
            type="submit"
            value={FORM_TEXTS.BUTTON_SAVE}
          />
          <button
            type="button"
            className="btn btn-cancel"
            onClick={handleCancel}
          >
            {FORM_TEXTS.BUTTON_CANCEL}
          </button>
        </div>
      ) : (
        <input
          className="btn"
          type="submit"
          value={FORM_TEXTS.BUTTON_CREATE}
        />
      )}
    </form>
  )
})

TodoForm.displayName = 'TodoForm'

export default TodoForm
