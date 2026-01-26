# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Adicionado
- Utilitário de validação TypeScript para app React
- Documentação completa de validações (VALIDACOES.md)
- Suporte cross-browser para validações
- EditorConfig para consistência de código
- ESLint e Prettier para qualidade de código
- nvmrc para versão consistente do Node.js
- **[SEGURANÇA]** Módulo `security-enhanced.js` com criptografia, rate limiting e sanitização
- **[SEGURANÇA]** Módulo `storage.js` para migração segura de localStorage → sessionStorage
- **[DOCS]** Guia completo de segurança em `SECURITY.md`

### Modificado
- Validações do formulário de entrega com mensagens contextuais
- Sistema de mensagens de erro diferenciadas (formato vs completude)
- **[SEGURANÇA CRÍTICA]** CSP removeu `'unsafe-inline'` de script-src e style-src em todos os HTMLs
- **[SEGURANÇA]** Event handlers inline (`onclick`) substituídos por `addEventListener`
- **[SEGURANÇA]** Preparado sistema de migração de dados sensíveis com criptografia

### Removido
- **[SEGURANÇA]** Atributos `onclick` inline (entrega.html, pagamento.html)

## [1.0.0] - 2026-01-26

### Adicionado
- Sistema completo de validação de formulários
- Validação de nome (sem números, min 3 caracteres)
- Validação de telefone (sem letras, 10-11 dígitos)
- Validação de CEP (sem letras, 8 dígitos)
- Validação de endereço (rua, bairro, cidade)
- Validação de bairro (sem números, min 2 caracteres)
- Validação de cidade (sem números, min 3 caracteres)
- Capitalização automática de nomes e endereços
- Máscaras automáticas para telefone e CEP
- Bloqueio de emojis em todos os campos
- Mensagens de erro aparecem apenas ao sair do campo (blur)
- Integração com API ViaCEP para busca de endereço

### Segurança
- Sanitização de inputs (remove emojis, URLs, caracteres de controle)
- Content Security Policy configurado
- Validação client-side robusta

### Interface
- Tema claro/escuro
- Design responsivo
- Feedback visual de erros
- Ícones emoji para melhor UX

### PWA
- Service Worker com cache strategy
- Manifest.json configurado
- Suporte offline básico

---

## Tipos de Mudanças

- `Adicionado` para novas funcionalidades
- `Modificado` para mudanças em funcionalidades existentes
- `Depreciado` para funcionalidades que serão removidas em breve
- `Removido` para funcionalidades removidas
- `Corrigido` para correção de bugs
- `Segurança` para vulnerabilidades corrigidas

## Links

- [Unreleased]: https://github.com/Kadumarino/app-kadu-lanches/compare/v1.0.0...HEAD
- [1.0.0]: https://github.com/Kadumarino/app-kadu-lanches/releases/tag/v1.0.0
