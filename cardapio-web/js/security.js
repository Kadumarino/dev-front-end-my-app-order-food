// ===============================================
// MÓDULO DE SEGURANÇA
// ===============================================
// Funções para sanitização e validação de dados

/**
 * Sanitiza texto contra ataques XSS
 * @param {string} text - Texto a ser sanitizado
 * @returns {string} Texto sanitizado
 */
function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Sanitiza HTML removendo tags perigosas
 * @param {string} html - HTML a ser sanitizado
 * @returns {string} HTML sanitizado
 */
function sanitizeHTML(html) {
  if (typeof html !== 'string') return '';
  
  const allowedTags = ['b', 'i', 'em', 'strong', 'br', 'p', 'span'];
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Remove scripts e eventos
  const scripts = div.querySelectorAll('script, style, iframe, object, embed');
  scripts.forEach(el => el.remove());
  
  // Remove atributos perigosos
  const allElements = div.querySelectorAll('*');
  allElements.forEach(el => {
    const attrs = [...el.attributes];
    attrs.forEach(attr => {
      if (attr.name.startsWith('on') || attr.name === 'href' && attr.value.startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    });
    
    // Remove tags não permitidas
    if (!allowedTags.includes(el.tagName.toLowerCase())) {
      el.replaceWith(...el.childNodes);
    }
  });
  
  return div.innerHTML;
}

/**
 * Valida e sanitiza entrada de formulário
 * @param {Object} data - Dados do formulário
 * @returns {Object} Dados sanitizados
 */
function sanitizeFormData(data) {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value).trim();
    } else if (typeof value === 'number') {
      sanitized[key] = Number.isFinite(value) ? value : 0;
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Valida telefone brasileiro
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean} True se válido
 */
function validatePhone(phone) {
  if (typeof phone !== 'string') return false;
  const cleaned = phone.replace(/\D/g, '');
  return /^[1-9]{2}9?[0-9]{8}$/.test(cleaned);
}

/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se válido
 */
function validateEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida CEP brasileiro
 * @param {string} cep - CEP a ser validado
 * @returns {boolean} True se válido
 */
function validateCEP(cep) {
  if (typeof cep !== 'string') return false;
  const cleaned = cep.replace(/\D/g, '');
  return /^[0-9]{8}$/.test(cleaned);
}

/**
 * Limita tamanho de string
 * @param {string} text - Texto a ser limitado
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} Texto limitado
 */
function limitLength(text, maxLength) {
  if (typeof text !== 'string') return '';
  return text.slice(0, maxLength);
}

/**
 * Valida quantidade de item
 * @param {number} quantity - Quantidade
 * @param {number} max - Máximo permitido
 * @returns {number} Quantidade válida
 */
function validateQuantity(quantity, max = 10) {
  const num = parseInt(quantity, 10);
  if (!Number.isFinite(num) || num < 1) return 1;
  if (num > max) return max;
  return num;
}

/**
 * Valida preço
 * @param {number} price - Preço
 * @returns {number} Preço válido
 */
function validatePrice(price) {
  const num = parseFloat(price);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.round(num * 100) / 100; // 2 casas decimais
}

/**
 * Implementa rate limiting simples
 * @param {string} key - Chave única para a ação
 * @param {number} maxAttempts - Máximo de tentativas
 * @param {number} windowMs - Janela de tempo em ms
 * @returns {boolean} True se permitido
 */
function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  const storageKey = `rateLimit_${key}`;
  
  let attempts = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  // Remove tentativas antigas
  attempts = attempts.filter(time => now - time < windowMs);
  
  // Verifica limite
  if (attempts.length >= maxAttempts) {
    return false;
  }
  
  // Adiciona nova tentativa
  attempts.push(now);
  localStorage.setItem(storageKey, JSON.stringify(attempts));
  
  return true;
}

/**
 * Limpa dados sensíveis do localStorage
 */
function clearSensitiveData() {
  const keysToKeep = ['theme', 'closedModalShown'];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
}
