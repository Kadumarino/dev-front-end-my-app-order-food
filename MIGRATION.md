# 🔄 Guia de Migração de Armazenamento

## Objetivo

Migrar de `localStorage` (persistente, não criptografado) para `sessionStorage` (temporário, criptografado) para aumentar a segurança dos dados sensíveis.

## 📋 Checklist de Migração

### Fase 1: Preparação ✅
- [x] Criar módulo `security-enhanced.js` com criptografia
- [x] Criar módulo `storage.js` com API compatível
- [x] Remover `'unsafe-inline'` do CSP
- [x] Documentar em `SECURITY.md`

### Fase 2: Migração Gradual 🔄
- [ ] Migrar `Store.js` para usar novo `storage.js`
- [ ] Atualizar `entrega.html` para usar `secureStorage`
- [ ] Migrar `shared.js` para `syncStore`
- [ ] Atualizar `CartController.js`
- [ ] Migrar `security.js` (rate limiting)

### Fase 3: Validação 📋
- [ ] Testar fluxo completo de pedido
- [ ] Verificar persistência de dados durante navegação
- [ ] Confirmar limpeza de dados ao fechar aba
- [ ] Validar criptografia/descriptografia
- [ ] Testar fallback para localStorage

## 🔧 Como Migrar

### ANTES (localStorage direto):
```javascript
// Salvar
localStorage.setItem('user', JSON.stringify(userData));

// Recuperar
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Remover
localStorage.removeItem('user');
```

### DEPOIS (storage.js seguro):

#### Opção 1: API Assíncrona (Recomendado - com criptografia)
```javascript
import { store } from './js/storage.js';

// Salvar
await store.setItem('user', userData);  // JSON automático

// Recuperar
const user = await store.getItem('user', {});  // Valor padrão: {}

// Remover
store.removeItem('user');

// Limpar tudo
store.clear();
```

#### Opção 2: API Síncrona (sem criptografia)
```javascript
import { syncStore } from './js/storage.js';

// Salvar
syncStore.setItem('user', userData);

// Recuperar
const userJSON = syncStore.getItem('user', 'null');
const user = JSON.parse(userJSON);

// Remover
syncStore.removeItem('user');
```

#### Opção 3: Helpers Específicos (Mais simples)
```javascript
import { secureStorage } from './js/storage.js';

// Usuário
await secureStorage.saveUser({ nome: 'João', telefone: '11999999999' });
const user = await secureStorage.getUser();  // null se não existir

// Carrinho
await secureStorage.saveCart([{ id: 1, qty: 2 }]);
const cart = await secureStorage.getCart();  // [] se vazio

// Pagamento
await secureStorage.savePayment({ method: 'pix' });
const payment = await secureStorage.getPayment();  // null se não existir

// Limpar tudo
await secureStorage.clearAll();
```

## 🎯 Exemplos Práticos

### 1. Migrar Store.js

**ANTES:**
```javascript
// src/scripts/services/Store.js
loadFromStorage() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  // ...
}

saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(this.state.cart));
  localStorage.setItem('user', JSON.stringify(this.state.user));
  // ...
}
```

**DEPOIS:**
```javascript
import { syncStore } from '../../js/storage.js';

loadFromStorage() {
  const cartJSON = syncStore.getItem('cart', '[]');
  const cart = JSON.parse(cartJSON);
  
  const userJSON = syncStore.getItem('user', 'null');
  const user = JSON.parse(userJSON);
  // ...
}

saveToStorage() {
  syncStore.setItem('cart', JSON.stringify(this.state.cart));
  syncStore.setItem('user', JSON.stringify(this.state.user));
  // ...
}
```

### 2. Migrar entrega.html

**ANTES:**
```javascript
// entrega.html (linha ~112)
const user = JSON.parse(localStorage.getItem('user')) || {};
// ... preenche campos ...

// Salvar (linha ~269)
localStorage.setItem('user', JSON.stringify(user));
```

**DEPOIS:**
```html
<script type="module">
import { secureStorage } from './js/storage.js';

// Carregar
const user = await secureStorage.getUser() || {};
// ... preenche campos ...

// Salvar
await secureStorage.saveUser(user);
</script>
```

### 3. Migrar shared.js (Tema)

**ANTES:**
```javascript
// js/shared.js
const savedTheme = localStorage.getItem('theme');
// ...
localStorage.setItem('theme', isDark ? 'dark' : 'light');
```

**DEPOIS:**
```javascript
import { themeStorage } from './storage.js';

const savedTheme = themeStorage.get();  // 'light' ou 'dark'
// ...
themeStorage.set(isDark ? 'dark' : 'light');

// Ou ainda mais simples:
const newTheme = themeStorage.toggle();  // Alterna automaticamente
```

## ⚠️ Pontos de Atenção

### 1. Dados Temporários (sessionStorage)
```javascript
// ✅ BOM - Dados sensíveis (limpa ao fechar aba)
await secureStorage.saveUser(userData);
await secureStorage.saveCart(cartItems);
await secureStorage.savePayment(paymentData);
```

```javascript
// ⚠️ CUIDADO - Tema pode ser localStorage (não é sensível)
themeStorage.set('dark');  // Persiste mesmo após fechar aba
```

### 2. Async/Await
```javascript
// ❌ ERRADO
const user = secureStorage.getUser();  // Retorna Promise!
console.log(user.nome);  // undefined

// ✅ CERTO
const user = await secureStorage.getUser();
console.log(user.nome);  // 'João'
```

### 3. Fallback Automático
```javascript
// Se sessionStorage falhar, usa localStorage automaticamente
// Útil para navegadores antigos ou modo privado
await store.setItem('key', 'value');  // Tenta sessionStorage → fallback localStorage
```

### 4. Migração Automática
```javascript
// No início da aplicação (app.js ou index.html)
import { store } from './js/storage.js';

// Migra dados antigos do localStorage
await store.migrate();
```

## 🧪 Como Testar

### 1. Verificar Criptografia
```javascript
// Salvar dado
await store.setItem('test', { secret: '123' });

// Ver no DevTools (deve estar criptografado)
console.log(sessionStorage.getItem('test'));
// Output: "U2FsdGVkX1..." (base64 criptografado)

// Recuperar
const data = await store.getItem('test');
console.log(data);  // { secret: '123' }
```

### 2. Verificar Temporalidade
1. Fazer um pedido completo
2. **Recarregar página (F5)**: Dados devem persistir ✅
3. **Fechar e reabrir aba**: Dados devem sumir ✅

### 3. Verificar Fallback
```javascript
// Simular erro no sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  get() { throw new Error('Disabled'); }
});

// Deve usar localStorage automaticamente
await store.setItem('test', 'value');  // Não deve dar erro
```

## 📊 Status da Migração

| Arquivo | Status | Prioridade |
|---------|--------|------------|
| `security-enhanced.js` | ✅ Criado | - |
| `storage.js` | ✅ Criado | - |
| `entrega.html` | 🔄 Pendente | Alta |
| `Store.js` | 🔄 Pendente | Alta |
| `shared.js` | 🔄 Pendente | Média |
| `CartController.js` | 🔄 Pendente | Média |
| `security.js` | 🔄 Pendente | Baixa |
| `app.js` | 🔄 Pendente | Baixa |

## 🚀 Próximos Passos

1. **Migrar entrega.html** (impacto imediato na UX)
2. **Migrar Store.js** (núcleo do sistema de estado)
3. **Testar fluxo completo de pedido**
4. **Migrar arquivos restantes**
5. **Remover usos diretos de localStorage** (exceto tema)
6. **Adicionar testes automatizados**

## 📚 Referências

- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [OWASP Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage)

---

**Última atualização:** 26 de janeiro de 2026  
**Autor:** GitHub Copilot  
**Status:** Fase 3 - Segurança Básica 🔒
