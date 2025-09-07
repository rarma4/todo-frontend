import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Dados mock para os testes
export const mockTodos = [
  {
    id: 1,
    name: 'Tarefa Teste 1',
    description: 'Descrição da tarefa teste 1'
  },
  {
    id: 2,
    name: 'Tarefa Teste 2',
    description: 'Descrição da tarefa teste 2'
  }
]

// Função para resetar os dados mock
export const resetMockTodos = () => {
  mockTodos.length = 0
  mockTodos.push(
    {
      id: 1,
      name: 'Tarefa Teste 1',
      description: 'Descrição da tarefa teste 1'
    },
    {
      id: 2,
      name: 'Tarefa Teste 2',
      description: 'Descrição da tarefa teste 2'
    }
  )
}

// Handlers para interceptar as chamadas da API
export const handlers = [
  // GET /todos - Buscar todos os todos
  http.get('https://todo-backend-t1qi.onrender.com/todos', () => {
    return HttpResponse.json(mockTodos)
  }),

  // POST /todos - Criar novo todo
  http.post('https://todo-backend-t1qi.onrender.com/todos', async ({ request }) => {
    const newTodo = await request.json()
    const todo = {
      id: Date.now(),
      ...newTodo
    }
    mockTodos.push(todo)
    return HttpResponse.json(todo, { status: 201 })
  }),

  // PUT /todos/:id - Atualizar todo
  http.put('https://todo-backend-t1qi.onrender.com/todos/:id', async ({ request, params }) => {
    const updatedTodo = await request.json()
    const todoIndex = mockTodos.findIndex(todo => todo.id === parseInt(params.id))
    
    if (todoIndex !== -1) {
      mockTodos[todoIndex] = { ...mockTodos[todoIndex], ...updatedTodo }
      return HttpResponse.json(mockTodos[todoIndex])
    }
    
    return HttpResponse.json({ error: 'Todo not found' }, { status: 404 })
  }),

  // DELETE /todos/:id - Deletar todo
  http.delete('https://todo-backend-t1qi.onrender.com/todos/:id', ({ params }) => {
    const todoIndex = mockTodos.findIndex(todo => todo.id === parseInt(params.id))
    
    if (todoIndex !== -1) {
      mockTodos.splice(todoIndex, 1)
      return HttpResponse.json({ message: 'Todo deleted successfully' })
    }
    
    return HttpResponse.json({ error: 'Todo not found' }, { status: 404 })
  }),
]

// Configura o servidor MSW
export const server = setupServer(...handlers)
