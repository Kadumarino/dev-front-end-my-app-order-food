# 📋 Sistema de Validações - Formulário de Entrega

## ✅ Validações Implementadas

### Campo Nome
- ❌ **Não pode conter números**
- ✅ **Mínimo 3 caracteres**
- ✅ **Capitalização automática** (Ex: "joão silva" → "João Silva")
- 🚫 **Bloqueio de emojis**

**Mensagens de erro:**
- "O nome não pode conter números. Por favor, informe o nome correto."
- "Por favor, informe o nome completo."

### Campo Telefone (WhatsApp)
- ❌ **Não pode conter letras**
- ✅ **Deve estar completo** (10 ou 11 dígitos)
- ✅ **Máscara automática**: `(XX) XXXXX-XXXX` ou `(XX) XXXX-XXXX`
- 🚫 **Bloqueio de emojis**

**Mensagens de erro:**
- "O telefone não pode conter letras. Por favor, informe o telefone correto."
- "O campo telefone está incompleto."

### Campo Telefone Adicional (Opcional)
- Mesmas regras do telefone principal
- Campo opcional (pode ficar vazio)

### Campo CEP
- ❌ **Não pode conter letras**
- ✅ **Deve estar completo** (8 dígitos)
- ✅ **Máscara automática**: `XXXXX-XXX`
- 🔍 **Busca automática de endereço** via API ViaCEP
- 🚫 **Bloqueio de emojis**

**Mensagens de erro:**
- "O CEP não pode conter letras. Por favor, informe o CEP correto."
- "O campo CEP está incompleto."

### Campo Rua
- ✅ **Mínimo 2 caracteres**
- ✅ **Capitalização automática**
- 🚫 **Bloqueio de emojis**

**Mensagem de erro:**
- "Por favor, insira a rua completa."

### Campo Número
- ✅ **Aceita letras e números** (Ex: "123", "123A", "S/N")
- 🚫 **Bloqueio de emojis**

### Campo Bairro
- ❌ **Não pode conter números**
- ✅ **Mínimo 2 caracteres**
- ✅ **Capitalização automática**
- 🚫 **Bloqueio de emojis**

**Mensagens de erro:**
- "O bairro não pode conter números."
- "Por favor, insira o bairro completo."

### Campo Cidade
- ❌ **Não pode conter números**
- ✅ **Mínimo 3 caracteres**
- ✅ **Capitalização automática**
- 🚫 **Bloqueio de emojis**

**Mensagens de erro:**
- "A cidade não pode conter números."
- "Por favor, insira a cidade completa."

### Campo Referência (Opcional)
- ✅ **Capitalização automática**
- 🚫 **Bloqueio de emojis**
- Campo opcional (pode ficar vazio)

## 🎯 Comportamento das Validações

### Quando as mensagens aparecem?
- ✅ **Apenas ao sair do campo** (evento `blur`)
- ❌ **NÃO aparecem durante a digitação**
- 🎨 **Cor vermelha** (#f44336) para destacar erros

### Prioridade de Mensagens
1. **Erros de formato** (letras onde não pode, números onde não pode)
2. **Erros de completude** (campo incompleto, muito curto)

### Ordem de Validação no Submit
1. Nome
2. Telefone
3. Telefone Adicional (se preenchido)
4. CEP
5. Endereço completo (rua, bairro, cidade)
6. Número

## 🌐 Compatibilidade de Navegadores

### Desktop
- ✅ Google Chrome (última versão)
- ✅ Mozilla Firefox (última versão)
- ✅ Safari (macOS)
- ✅ Microsoft Edge (última versão)
- ✅ Opera (última versão)

### Mobile
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)
- ✅ Samsung Internet
- ✅ Firefox Mobile
- ✅ Edge Mobile

### Navegadores mais antigos
- ✅ Chrome 60+
- ✅ Firefox 54+
- ✅ Safari 10.1+
- ✅ Edge 79+ (Chromium)

## 🛠️ Tecnologias Utilizadas

### HTML5
- Formulários semânticos
- Atributos `required`, `aria-required`, `aria-invalid`
- Placeholders descritivos
- Máximos de caracteres (`maxlength`)

### JavaScript Vanilla (ES6+)
- Arrow functions
- Template literals
- Async/await
- Destructuring
- Regex Unicode (`/u` flag)

### CSS Inline
- Mensagens de erro com `display: none`
- Cores de erro (`#f44336`)
- Ícones emoji para melhor UX

## 📱 App React (TypeScript)

As mesmas validações estão disponíveis no app React em:
```
cardapio-react/src/utils/validation.ts
```

### Funções disponíveis:
- `sanitizeInput()` - Remove emojis e caracteres inválidos
- `validateName()` - Valida nome
- `validatePhone()` - Valida telefone
- `validateCEP()` - Valida CEP
- `validateBairro()` - Valida bairro
- `validateCidade()` - Valida cidade
- `validateNumber()` - Valida número
- `maskPhone()` - Aplica máscara de telefone
- `maskCEP()` - Aplica máscara de CEP
- `capitalizeAsYouType()` - Capitaliza texto
- `capitalizeName()` - Capitaliza nome próprio

### Com detalhes de erro:
- `validateNameWithError()` - Retorna `ValidationResult`
- `validatePhoneWithError()` - Retorna `ValidationResult`
- `validateCEPWithError()` - Retorna `ValidationResult`
- `validateBairroWithError()` - Retorna `ValidationResult`
- `validateCidadeWithError()` - Retorna `ValidationResult`

## 🔒 Segurança

### Sanitização de Entrada
- Remove emojis (previne problemas de encoding)
- Remove URLs/links (previne spam)
- Remove caracteres de controle
- Normaliza espaços múltiplos

### Validação no Cliente E Servidor
⚠️ **Importante**: Validações client-side são para UX. 
**Sempre valide novamente no servidor!**

## 📝 Exemplos de Uso

### JavaScript Vanilla (HTML)
```javascript
// Setup de validação com mensagens de erro
setupNameValidationWithError('del-nome', 'nome-error-numbers', 'nome-error-incomplete');
setupPhoneValidationWithError('del-telefone', 'telefone-error-letters', 'telefone-error-incomplete');
setupCepValidationWithError('del-cep', 'cep-error-letters', 'cep-error-incomplete');
setupBairroValidationWithError('del-bairro', 'bairro-error-numbers', 'bairro-error-incomplete');
setupCidadeValidationWithError('del-cidade', 'cidade-error-numbers', 'cidade-error-incomplete');
```

### React + TypeScript
```typescript
import { validateNameWithError, ValidationResult } from './utils/validation';

const handleNameBlur = (name: string) => {
  const result: ValidationResult = validateNameWithError(name);
  
  if (!result.isValid) {
    console.log(result.errorType); // 'CONTAINS_NUMBERS' | 'INCOMPLETE' | 'TOO_SHORT'
    console.log(result.message); // Mensagem de erro amigável
  }
};
```

## 🧪 Testes

### Cenários de Teste

#### Nome
- ✅ "João Silva" → Válido
- ❌ "João123" → "O nome não pode conter números"
- ❌ "Jo" → "Por favor, informe o nome completo"

#### Telefone
- ✅ "(11) 99999-9999" → Válido
- ✅ "(11) 9999-9999" → Válido
- ❌ "(11) 9999A-9999" → "O telefone não pode conter letras"
- ❌ "(11) 9999-999" → "O campo telefone está incompleto"

#### CEP
- ✅ "12345-678" → Válido
- ❌ "1234A-678" → "O CEP não pode conter letras"
- ❌ "12345-67" → "O campo CEP está incompleto"

#### Bairro
- ✅ "Centro" → Válido
- ❌ "Centro1" → "O bairro não pode conter números"
- ❌ "C" → "Por favor, insira o bairro completo"

#### Cidade
- ✅ "São Paulo" → Válido
- ❌ "São Paulo 1" → "A cidade não pode conter números"
- ❌ "SP" → "Por favor, insira a cidade completa"

## 📊 Métricas

- **Total de validações**: 9 campos
- **Campos obrigatórios**: 7
- **Campos opcionais**: 2
- **Tipos de erro**: 2-3 por campo
- **Compatibilidade**: 100% navegadores modernos

## 🚀 Melhorias Futuras

- [ ] Validação de CPF (opcional)
- [ ] Validação de email (opcional)
- [ ] Verificação de CEP duplicado
- [ ] Histórico de endereços salvos
- [ ] Autocompletar endereço baseado em GPS
- [ ] Validação assíncrona no servidor
- [ ] Testes unitários automatizados
- [ ] Testes E2E com Cypress/Playwright

---

**Última atualização**: 26 de janeiro de 2026
**Versão**: 1.0.0
**Mantido por**: Kadu Lanches Development Team
