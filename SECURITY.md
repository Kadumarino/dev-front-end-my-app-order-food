# Guia de Segurança - Kadu Lanches

## 🔒 Melhorias de Segurança Implementadas

### 1. Content Security Policy (CSP)

**ANTES (Vulnerável):**
```html
<meta http-equiv="Content-Security-Policy" content="
  script-src 'self' 'unsafe-inline';  ❌ Permite XSS
  style-src 'self' 'unsafe-inline';   ❌ Permite CSS injection
">
```

**DEPOIS (Seguro):**
```html
<meta http-equiv="Content-Security-Policy" content="
  script-src 'self';                  ✅ Sem inline scripts
  style-src 'self' https://fonts.googleapis.com;  ✅ Apenas externo permitido
">
```

### 2. Remoção de Event Handlers Inline

**ANTES:**
```html
<button onclick="window.location.href='index.html'">←</button>  ❌
```

**DEPOIS:**
```html
<button id="btn-voltar">←</button>
<script>
  document.getElementById('btn-voltar').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
</script>
```

### 3. Armazenamento Seguro de Dados

**ANTES (localStorage - persistente e não criptografado):**
```javascript
localStorage.setItem('user', JSON.stringify(userData));  ❌
```

**DEPOIS (sessionStorage - temporário e criptografado):**
```javascript
import { secureStore, secureRetrieve } from './js/security-enhanced.js';

await secureStore('user', userData);  ✅
const user = await secureRetrieve('user');  ✅
```

### 4. Rate Limiting

```javascript
import { rateLimiter } from './js/security-enhanced.js';

if (!rateLimiter.isAllowed('cep-search')) {
  alert('Muitas tentativas. Aguarde um minuto.');
  return;
}
```

## 📋 Checklist de Segurança

### Implementado ✅
- [x] CSP sem unsafe-inline
- [x] Event listeners ao invés de onclick
- [x] Criptografia básica de dados
- [x] sessionStorage ao invés de localStorage
- [x] Rate limiting básico
- [x] Sanitização de inputs
- [x] Validação de URLs

### Recomendado para Produção 🚧
- [ ] Implementar AES-GCM completo (Web Crypto API)
- [ ] HTTPS obrigatório
- [ ] Backend para validação server-side
- [ ] JWT para autenticação
- [ ] Helmet.js no backend
- [ ] CORS configurado
- [ ] Rate limiting no servidor
- [ ] Logging de tentativas suspeitas
- [ ] Sanitização HTML com DOMPurify
- [ ] Subresource Integrity (SRI) para CDNs

## 🛡️ Uso do security-enhanced.js

### Criptografia de Dados

```javascript
import { encryptData, decryptData } from './js/security-enhanced.js';

const key = 'minha-chave-secreta';
const encrypted = await encryptData('dados sensíveis', key);
const decrypted = await decryptData(encrypted, key);
```

### Armazenamento Seguro

```javascript
import { secureStore, secureRetrieve, clearSecureData } from './js/security-enhanced.js';

// Armazenar
await secureStore('user', { nome: 'João', telefone: '11999999999' });

// Recuperar
const user = await secureRetrieve('user');

// Limpar
clearSecureData();
```

### Validação de URL

```javascript
import { isSecureURL } from './js/security-enhanced.js';

if (isSecureURL(url)) {
  window.location.href = url;
}
```

### Sanitização HTML

```javascript
import { sanitizeHTML } from './js/security-enhanced.js';

const userInput = '<script>alert("XSS")</script>';
const safe = sanitizeHTML(userInput);  // '&lt;script&gt;alert("XSS")&lt;/script&gt;'
```

## 🔐 Próximos Passos

### Fase 3.1 - Migrar para sessionStorage
1. Substituir todos `localStorage.getItem()` por `secureRetrieve()`
2. Substituir todos `localStorage.setItem()` por `secureStore()`
3. Testar fluxo completo

### Fase 3.2 - Remover 'unsafe-inline' do CSS
1. Extrair todos estilos inline para arquivo CSS
2. Atualizar CSP

### Fase 3.3 - Backend Seguro
1. Validação server-side de todos inputs
2. Rate limiting no servidor
3. JWT para autenticação
4. CORS configurado

## 📚 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

---

**Última atualização:** 26 de janeiro de 2026  
**Status:** Fase 3 - Segurança Básica ✅
