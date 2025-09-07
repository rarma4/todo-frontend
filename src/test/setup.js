import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { server, resetMockTodos } from './mocks/server'

// Estabelece interceptadores de API para todos os testes
beforeAll(() => server.listen())

// Reseta qualquer interceptador de runtime que possamos adicionar durante os testes
afterEach(() => {
  server.resetHandlers()
  resetMockTodos()
  // Limpa todos os mocks após cada teste
  vi.clearAllMocks()
})

// Limpa os interceptadores após os testes
afterAll(() => server.close())

