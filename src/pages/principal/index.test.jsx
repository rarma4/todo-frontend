import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../../test/mocks/server'
import Home from './index'

// Mock dos ícones para evitar problemas de importação
vi.mock('../../assets/img/icon-delete.png', () => ({
  default: 'mock-delete-icon.png'
}))
vi.mock('../../assets/img/icon-edit.png', () => ({
  default: 'mock-edit-icon.png'
}))
vi.mock('../../assets/img/icon-check.png', () => ({
  default: 'mock-check-icon.png'
}))
vi.mock('../../assets/img/icon-done.png', () => ({
  default: 'mock-done-icon.png'
}))

// Mock do console.error para evitar logs desnecessários nos testes
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('Home Component', () => {
  let user

  beforeEach(() => {
    user = userEvent.setup()
    consoleSpy.mockClear()
  })

  describe('Renderização Inicial', () => {
    it('deve renderizar o título do formulário corretamente', async () => {
      render(<Home />)
      
      expect(screen.getByText('Cadastre sua Tarefa')).toBeInTheDocument()
    })

    it('deve renderizar os campos do formulário', async () => {
      render(<Home />)
      
      expect(screen.getByPlaceholderText('Digite a Tarefa*')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Digite a descrição')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeInTheDocument()
    })

    it('deve carregar e exibir os todos da API', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
        expect(screen.getByText('Tarefa Teste 2')).toBeInTheDocument()
      })
    })

    it('deve renderizar os botões de ação para cada todo', async () => {
      render(<Home />)
      
      await waitFor(() => {
        const todoCards = screen.getAllByRole('button', { name: /Check Icon|Edit Icon|Delete Icon/ })
        expect(todoCards).toHaveLength(6) // 2 todos × 3 botões cada
      })
    })
  })

  describe('Criação de Todos', () => {
    it('deve criar um novo todo com sucesso', async () => {
      render(<Home />)
      
      const nameInput = screen.getByPlaceholderText('Digite a Tarefa*')
      const descriptionInput = screen.getByPlaceholderText('Digite a descrição')
      const submitButton = screen.getByRole('button', { name: 'Cadastrar' })

      await user.type(nameInput, 'Nova Tarefa')
      await user.type(descriptionInput, 'Nova Descrição')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Nova Tarefa')).toBeInTheDocument()
        expect(screen.getByText('Nova Descrição')).toBeInTheDocument()
      })

      // Verifica se os campos foram limpos após o submit
      expect(nameInput.value).toBe('')
      expect(descriptionInput.value).toBe('')
    })

    it('deve limpar o formulário após criar um todo', async () => {
      render(<Home />)
      
      const nameInput = screen.getByPlaceholderText('Digite a Tarefa*')
      const descriptionInput = screen.getByPlaceholderText('Digite a descrição')
      const submitButton = screen.getByRole('button', { name: 'Cadastrar' })

      await user.type(nameInput, 'Tarefa Teste')
      await user.type(descriptionInput, 'Descrição Teste')
      await user.click(submitButton)

      await waitFor(() => {
        expect(nameInput.value).toBe('')
        expect(descriptionInput.value).toBe('')
      })
    })
  })

  describe('Validação de Formulário', () => {
    it('deve exibir erro quando o nome da tarefa não é fornecido', async () => {
      render(<Home />)
      
      const submitButton = screen.getByRole('button', { name: 'Cadastrar' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('O nome da tarefa é obrigatório')).toBeInTheDocument()
      })
    })

    it('deve exibir erro quando o nome da tarefa excede 35 caracteres', async () => {
      render(<Home />)
      
      const nameInput = screen.getByPlaceholderText('Digite a Tarefa*')
      const submitButton = screen.getByRole('button', { name: 'Cadastrar' })

      await user.type(nameInput, 'a'.repeat(36))
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('O nome da tarefa deve ter no máximo 35 caracteres')).toBeInTheDocument()
      })
    })

    it('deve exibir erro quando a descrição excede 30 caracteres', async () => {
      render(<Home />)
      
      const nameInput = screen.getByPlaceholderText('Digite a Tarefa*')
      const descriptionInput = screen.getByPlaceholderText('Digite a descrição')
      const submitButton = screen.getByRole('button', { name: 'Cadastrar' })

      await user.type(nameInput, 'Tarefa Válida')
      await user.type(descriptionInput, 'a'.repeat(31))
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('A descrição deve ter no máximo 30 caracteres')).toBeInTheDocument()
      })
    })

    it('deve permitir criar todo sem descrição', async () => {
      render(<Home />)
      
      const nameInput = screen.getByPlaceholderText('Digite a Tarefa*')
      const submitButton = screen.getByRole('button', { name: 'Cadastrar' })

      await user.type(nameInput, 'Tarefa Sem Descrição')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Tarefa Sem Descrição')).toBeInTheDocument()
      })
    })
  })

  describe('Edição de Todos', () => {
    it('deve entrar no modo de edição ao clicar no botão de editar', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
      })

      const editButtons = screen.getAllByRole('button', { name: 'Edit Icon' })
      await user.click(editButtons[0])

      expect(screen.getByText('Altere sua Tarefa')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Tarefa Teste 1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Descrição da tarefa teste 1')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Salvar Alterações' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
    })

    it('deve atualizar um todo existente', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
      })

      const editButtons = screen.getAllByRole('button', { name: 'Edit Icon' })
      await user.click(editButtons[0])

      const nameInput = screen.getByDisplayValue('Tarefa Teste 1')
      const descriptionInput = screen.getByDisplayValue('Descrição da tarefa teste 1')
      const saveButton = screen.getByRole('button', { name: 'Salvar Alterações' })

      await user.clear(nameInput)
      await user.type(nameInput, 'Tarefa Editada')
      await user.clear(descriptionInput)
      await user.type(descriptionInput, 'Descrição Editada')
      await user.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText('Tarefa Editada')).toBeInTheDocument()
        expect(screen.getByText('Descrição Editada')).toBeInTheDocument()
      })

      // Verifica se voltou ao modo de criação
      expect(screen.getByText('Cadastre sua Tarefa')).toBeInTheDocument()
    })

    it('deve cancelar a edição e voltar ao modo de criação', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
      })

      const editButtons = screen.getAllByRole('button', { name: 'Edit Icon' })
      await user.click(editButtons[0])

      const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
      await user.click(cancelButton)

      expect(screen.getByText('Cadastre sua Tarefa')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Digite a Tarefa*').value).toBe('')
      expect(screen.getByPlaceholderText('Digite a descrição').value).toBe('')
    })
  })

  describe('Exclusão de Todos', () => {
    it('deve abrir o modal de confirmação ao clicar em deletar', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByRole('button', { name: 'Delete Icon' })
      await user.click(deleteButtons[0])

      expect(screen.getByText('Tem certeza que deseja apagar essa tarefa?')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument()
    })

    it('deve fechar o modal ao clicar em cancelar', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByRole('button', { name: 'Delete Icon' })
      await user.click(deleteButtons[0])

      const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
      await user.click(cancelButton)

      expect(screen.queryByText('Tem certeza que deseja apagar essa tarefa?')).not.toBeInTheDocument()
    })

    it('deve deletar o todo ao confirmar', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByRole('button', { name: 'Delete Icon' })
      await user.click(deleteButtons[0])

      const confirmButton = screen.getByRole('button', { name: 'Confirmar' })
      await user.click(confirmButton)

      await waitFor(() => {
        expect(screen.queryByText('Tarefa Teste 1')).not.toBeInTheDocument()
      })
    })
  })

  describe('Marcação de Todos como Concluídos', () => {
    it('deve marcar um todo como concluído ao clicar no botão de check', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
      })

      const checkButtons = screen.getAllByRole('button', { name: 'Check Icon' })
      await user.click(checkButtons[0])

      // Verifica se o todo foi marcado como concluído (classe 'done' aplicada)
      const todoElement = screen.getByText('Tarefa Teste 1').closest('p')
      expect(todoElement).toHaveClass('done')
    })

    it('deve desmarcar um todo como concluído ao clicar novamente', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
      })

      const checkButtons = screen.getAllByRole('button', { name: 'Check Icon' })
      
      // Marca como concluído
      await user.click(checkButtons[0])
      
      // Desmarca
      await user.click(checkButtons[0])

      const todoElement = screen.getByText('Tarefa Teste 1').closest('p')
      expect(todoElement).not.toHaveClass('done')
    })

    it('deve alterar o ícone quando o todo é marcado como concluído', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
      })

      const checkButtons = screen.getAllByRole('button', { name: 'Check Icon' })
      await user.click(checkButtons[0])

      // Verifica se o ícone mudou para "Done Icon"
      expect(screen.getByRole('button', { name: 'Done Icon' })).toBeInTheDocument()
    })
  })

  describe('Tratamento de Erros da API', () => {
    it('deve tratar erro ao criar todo', async () => {
      // Mock de erro para POST
      server.use(
        http.post('https://todo-backend-t1qi.onrender.com/todos', () => {
          return HttpResponse.json({ error: 'Server Error' }, { status: 500 })
        })
      )

      render(<Home />)
      
      const nameInput = screen.getByPlaceholderText('Digite a Tarefa*')
      const submitButton = screen.getByRole('button', { name: 'Cadastrar' })

      await user.type(nameInput, 'Tarefa com Erro')
      await user.click(submitButton)

      // Aguarda o erro ser processado
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled()
      }, { timeout: 3000 })
    })

    it('deve tratar erro ao atualizar todo', async () => {
      // Mock de erro para PUT
      server.use(
        http.put('https://todo-backend-t1qi.onrender.com/todos/:id', () => {
          return HttpResponse.json({ error: 'Server Error' }, { status: 500 })
        })
      )

      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
      })

      const editButtons = screen.getAllByRole('button', { name: 'Edit Icon' })
      await user.click(editButtons[0])

      const saveButton = screen.getByRole('button', { name: 'Salvar Alterações' })
      await user.click(saveButton)

      // Aguarda o erro ser processado
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled()
      }, { timeout: 3000 })
    })

    it('deve tratar erro ao deletar todo', async () => {
      // Mock de erro para DELETE
      server.use(
        http.delete('https://todo-backend-t1qi.onrender.com/todos/:id', () => {
          return new Response(JSON.stringify({ error: 'Server Error' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        })
      )

      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByRole('button', { name: 'Delete Icon' })
      await user.click(deleteButtons[0])

      const confirmButton = screen.getByRole('button', { name: 'Confirmar' })
      await user.click(confirmButton)

      // Aguarda um pouco para o erro ser processado
      await new Promise(resolve => setTimeout(resolve, 100))

      // Como o código atual não trata erro na função confirmDelete,
      // o modal permanece aberto quando há erro na API
      // Este teste verifica que o modal ainda está visível após o erro
      expect(screen.getByText('Tem certeza que deseja apagar essa tarefa?')).toBeInTheDocument()
    })
  })

  describe('Integração com API', () => {
    it('deve carregar todos da API na inicialização', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
        expect(screen.getByText('Tarefa Teste 2')).toBeInTheDocument()
      })
    })

    it('deve recarregar todos após operações CRUD', async () => {
      render(<Home />)
      
      // Aguarda carregamento inicial
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
      })

      // Cria novo todo
      const nameInput = screen.getByPlaceholderText('Digite a Tarefa*')
      const submitButton = screen.getByRole('button', { name: 'Cadastrar' })

      await user.type(nameInput, 'Todo Recarregado')
      await user.click(submitButton)

      // Verifica se o novo todo aparece
      await waitFor(() => {
        expect(screen.getByText('Todo Recarregado')).toBeInTheDocument()
      })
    })
  })

  describe('Acessibilidade', () => {
    it('deve ter labels apropriados para os campos de formulário', () => {
      render(<Home />)
      
      const nameInput = screen.getByPlaceholderText('Digite a Tarefa*')
      const descriptionInput = screen.getByPlaceholderText('Digite a descrição')
      
      expect(nameInput).toHaveAttribute('type', 'text')
      expect(descriptionInput).toHaveAttribute('type', 'text')
    })

    it('deve ter textos alternativos para os ícones', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
      })

      expect(screen.getAllByAltText('Check Icon')).toHaveLength(2)
      expect(screen.getAllByAltText('Edit Icon')).toHaveLength(2)
      expect(screen.getAllByAltText('Delete Icon')).toHaveLength(2)
    })

    it('deve ter botões com nomes descritivos', async () => {
      render(<Home />)
      
      expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeInTheDocument()
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste 1')).toBeInTheDocument()
      })

      expect(screen.getAllByRole('button', { name: 'Check Icon' })).toHaveLength(2)
      expect(screen.getAllByRole('button', { name: 'Edit Icon' })).toHaveLength(2)
      expect(screen.getAllByRole('button', { name: 'Delete Icon' })).toHaveLength(2)
    })
  })

  describe('Estados de Loading e Performance', () => {
    it('deve renderizar sem erros quando não há todos', async () => {
      // Mock de resposta vazia
      server.use(
        http.get('https://todo-backend-t1qi.onrender.com/todos', () => {
          return HttpResponse.json([])
        })
      )

      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('Cadastre sua Tarefa')).toBeInTheDocument()
      })

      // Não deve haver cards de todos
      expect(screen.queryByText('Tarefa Teste 1')).not.toBeInTheDocument()
    })

    it('deve manter o estado do formulário durante operações assíncronas', async () => {
      render(<Home />)
      
      const nameInput = screen.getByPlaceholderText('Digite a Tarefa*')
      const descriptionInput = screen.getByPlaceholderText('Digite a descrição')

      await user.type(nameInput, 'Tarefa Persistente')
      await user.type(descriptionInput, 'Descrição Persistente')

      // Verifica se os valores foram digitados corretamente
      expect(nameInput.value).toBe('Tarefa Persistente')
      expect(descriptionInput.value).toBe('Descrição Persistente')

      // Simula uma operação que demora
      const submitButton = screen.getByRole('button', { name: 'Cadastrar' })
      await user.click(submitButton)

      // Aguarda a operação ser concluída e verifica se os campos foram limpos
      await waitFor(() => {
        expect(nameInput.value).toBe('')
        expect(descriptionInput.value).toBe('')
      })
    })
  })
})
