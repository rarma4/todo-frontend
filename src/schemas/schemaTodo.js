import * as yup from "yup"

const schemaTodo = yup
  .object({
    name: yup.string().required("O nome da tarefa é obrigatório").max(35, "O nome da tarefa deve ter no máximo 35 caracteres"),
    description: yup.string().max(30, "A descrição deve ter no máximo 30 caracteres"),
  })
  .required()

export default schemaTodo;