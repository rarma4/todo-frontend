# Todo Frontend

Aplicação frontend para gerenciamento de tarefas (todos) desenvolvida em React. Este projeto faz parte de um conjunto de estudos sobre React, trabalhando em conjunto com o [todo-backend](https://github.com/rarma4/todo-backend).

## 🚀 Tecnologias Utilizadas

- **React 19.1.1** - Biblioteca para construção de interfaces
- **Vite 7.1.0** - Build tool e servidor de desenvolvimento
- **React Hook Form 7.62.0** - Gerenciamento de formulários
- **Yup 1.7.0** - Validação de schemas
- **Axios 1.11.0** - Cliente HTTP para comunicação com a API
- **ESLint** - Linting e padronização de código

## 📋 Funcionalidades

- ✅ Criar novas tarefas
- ✏️ Editar tarefas existentes
- 🗑️ Excluir tarefas
- ✅ Marcar tarefas como concluídas
- 📱 Interface responsiva
- 🔄 Validação de formulários
- 🎨 Interface moderna e intuitiva

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- O backend do projeto rodando (todo-backend)

### Passos para execução

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/todo-frontend.git
cd todo-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API no arquivo `src/services/api.js` (se necessário)

4. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

5. Acesse a aplicação em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── TodoCard.jsx    # Card de exibição da tarefa
│   ├── TodoForm.jsx    # Formulário de criação/edição
│   └── ConfirmationModal.jsx # Modal de confirmação
├── hooks/              # Custom hooks
│   └── useTodos.js     # Hook para gerenciamento de todos
├── pages/              # Páginas da aplicação
│   └── principal/      # Página principal
├── services/           # Serviços e configurações
│   └── api.js          # Configuração do Axios
├── schemas/            # Schemas de validação
│   └── schemaTodo.js   # Schema de validação para todos
├── constants/          # Constantes da aplicação
└── assets/             # Recursos estáticos
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🎯 Objetivos de Estudo

Este projeto foi desenvolvido com foco no aprendizado de:

- **React Hooks** (useState, useEffect, custom hooks)
- **Gerenciamento de Estado** em aplicações React
- **Formulários** com React Hook Form e validação
- **Comunicação com API** usando Axios
- **Componentização** e reutilização de código
- **Responsividade** e design moderno
- **Padrões de desenvolvimento** e boas práticas

## 🔗 Projeto Relacionado

Este frontend trabalha em conjunto com o [todo-backend](https://github.com/seu-usuario/todo-backend), que fornece a API REST para gerenciamento das tarefas.

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
