# 🍔 Kadu Lanches - Sistema de Pedidos Online

[![Node](https://img.shields.io/badge/node-%3E%3D20.11.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Sistema completo de pedidos online para restaurante com PWA, validações robustas e integração WhatsApp.

## 📁 Estrutura do Projeto

```
kadu-lanches/
├── cardapio-web/          # 🌐 Aplicação Web Principal (PWA)
│   ├── index.html         # Página principal do cardápio
│   ├── entrega.html       # Formulário de dados de entrega
│   ├── pagamento.html     # Seleção de forma de pagamento
│   ├── js/                # Scripts globais
│   │   ├── config.js      # Configurações
│   │   ├── shared.js      # Funções compartilhadas
│   │   ├── validation.js  # Validações de formulário
│   │   ├── notification.js# Sistema de notificações
│   │   └── security.js    # Funções de segurança
│   ├── src/
│   │   ├── scripts/
│   │   │   ├── app.js     # Inicialização da aplicação
│   │   │   ├── controllers/ # Controllers MVC
│   │   │   ├── models/    # Models de dados
│   │   │   ├── services/  # Serviços (API, Store)
│   │   │   └── utils/     # Utilidades
│   │   └── styles/        # CSS organizado
│   ├── data/
│   │   └── menu.json      # Dados do cardápio
│   ├── cardapio-react/    # ⚛️ Versão React (em desenvolvimento)
│   │   └── src/
│   │       └── utils/
│   │           └── validation.ts # Validações TypeScript
│   ├── backend/           # 🖥️ API Backend (estrutura)
│   │   ├── src/
│   │   │   ├── server.js
│   │   │   ├── config/    # Migrations, seeds, DB
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   └── routes/
│   │   └── package.json
│   └── manifest.json      # PWA Manifest
├── .github/               # GitHub Actions CI/CD
├── CHANGELOG.md           # Histórico de mudanças
├── VALIDACOES.md          # Documentação das validações
└── package.json           # Dependências do projeto

```

## 🚀 Quick Start

### Pré-requisitos

- Node.js >= 20.11.0
- npm >= 10.0.0

### Instalação

```bash
# Clonar repositório
git clone https://github.com/Kadumarino/app-kadu-lanches.git
cd app-kadu-lanches

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
cd cardapio-web
npx serve .
```

Acesse: `http://localhost:3000`

## 📋 Features

### ✅ Implementado

- [x] PWA (Progressive Web App)
- [x] Service Worker com cache offline
- [x] Tema claro/escuro
- [x] Validações robustas de formulário
- [x] Integração com API ViaCEP
- [x] Máscaras automáticas (telefone, CEP)
- [x] Carrinho de compras
- [x] Cálculo de total
- [x] Integração WhatsApp
- [x] Verificação de horário de funcionamento
- [x] Categorização de produtos
- [x] Personalização de pedidos
- [x] Responsivo (mobile-first)

### 🚧 Em Desenvolvimento

- [ ] Backend API REST
- [ ] Banco de dados PostgreSQL
- [ ] Autenticação JWT
- [ ] Painel administrativo
- [ ] App React completo
- [ ] Pagamento online
- [ ] Histórico de pedidos
- [ ] Sistema de cupons

## 🛠️ Stack Tecnológica

### Frontend
- HTML5 + CSS3 + JavaScript ES6+
- PWA (Service Worker)
- LocalStorage/SessionStorage
- Fetch API

### Backend (Planejado)
- Node.js + Express
- PostgreSQL
- JWT Authentication
- bcrypt para senhas

### DevOps
- GitHub Actions
- GitLab CI
- ESLint + Prettier
- Husky (Git Hooks)

## 📱 PWA Features

- ✅ Instalável (Add to Home Screen)
- ✅ Funciona offline
- ✅ Cache inteligente
- ✅ Ícones adaptativos
- ✅ Splash screen
- ✅ Theme color

## 🔒 Segurança

- Content Security Policy
- Sanitização de inputs
- Validação client-side
- HTTPS enforcement
- Rate limiting (planejado)

## 🧪 Quality

```bash
# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check
```

## 📄 Documentação

- [CHANGELOG.md](CHANGELOG.md) - Histórico de mudanças
- [VALIDACOES.md](VALIDACOES.md) - Documentação das validações
- [Backend API](backend/README.md) - Documentação da API (em breve)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Commit Convention

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

## 📞 Contato

- Telefone: (19) 98602-1602
- Email: contato@kadulanches.com
- Instagram: [@kadulanches](https://instagram.com/kadulanches)

## 📜 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ pela equipe Kadu Lanches**
