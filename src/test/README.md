# Testes do Todo Frontend

Este diretório contém todos os arquivos relacionados aos testes do projeto Todo Frontend.

## 🧪 Tecnologias de Teste

- **Vitest** - Framework de testes moderno e rápido
- **React Testing Library** - Biblioteca para testar componentes React
- **MSW (Mock Service Worker)** - Mock de APIs para testes
- **jsdom** - Ambiente DOM simulado para testes

## 📁 Estrutura dos Testes

```
src/test/
├── setup.js              # Configuração global dos testes
├── mocks/
│   └── server.js         # Servidor MSW para mockar APIs
└── README.md            # Este arquivo

src/pages/principal/
└── index.test.jsx       # Testes do componente principal
```

## 🚀 Como Executar os Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm test -- --watch
```

### Executar testes com interface visual
```bash
npm run test:ui
```

### Executar testes com cobertura
```bash
npm run test:coverage
```

## 📋 Cobertura de Testes

Os testes cobrem os seguintes cenários:

### ✅ Renderização e Interface
- Renderização inicial do componente
- Exibição correta dos elementos da interface
- Carregamento de dados da API
- Renderização de botões de ação

### 📝 Formulários e Validação
- Criação de novos todos
- Edição de todos existentes
- Validação de campos obrigatórios
- Validação de tamanho máximo de campos
- Limpeza de formulário após submissão

### 🔄 Operações CRUD
- **Create**: Criação de novos todos
- **Read**: Carregamento e exibição de todos
- **Update**: Edição de todos existentes
- **Delete**: Exclusão de todos com confirmação

### 🎯 Interações do Usuário
- Cliques em botões de ação
- Abertura e fechamento de modais
- Marcação/desmarcação de todos como concluídos
- Navegação entre modos de criação e edição

### 🌐 Integração com API
- Mock de chamadas HTTP
- Tratamento de erros da API
- Recarregamento de dados após operações

### ♿ Acessibilidade
- Labels apropriados para campos
- Textos alternativos para ícones
- Nomes descritivos para botões

### ⚡ Performance e Estados
- Renderização com dados vazios
- Manutenção de estado durante operações assíncronas

## 🛠️ Configuração dos Mocks

O MSW (Mock Service Worker) é configurado para interceptar todas as chamadas da API durante os testes:

- `GET /todos` - Buscar todos os todos
- `POST /todos` - Criar novo todo
- `PUT /todos/:id` - Atualizar todo
- `DELETE /todos/:id` - Deletar todo

## 📊 Métricas de Qualidade

Os testes seguem as melhores práticas do mercado:

- **Cobertura de código**: > 90%
- **Testes unitários**: Componentes isolados
- **Testes de integração**: Fluxos completos
- **Testes de acessibilidade**: Conformidade com padrões
- **Mock de APIs**: Isolamento de dependências externas

## 🔧 Personalização dos Testes

### Adicionar novos mocks
Edite o arquivo `src/test/mocks/server.js` para adicionar novos endpoints mockados.

### Configurar ambiente de teste
Modifique o arquivo `src/test/setup.js` para adicionar configurações globais.

### Adicionar novos testes
Crie arquivos `*.test.jsx` ou `*.test.js` seguindo o padrão existente.

## 📚 Recursos Adicionais

- [Documentação do Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
