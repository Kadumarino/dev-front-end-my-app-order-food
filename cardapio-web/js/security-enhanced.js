// ===============================================
// SECURITY UTILITIES - Funções de segurança
// Compatível com CSP strict (sem unsafe-inline)
// ===============================================

/**
 * Gera um nonce aleatório para CSP
 * @returns {string} Nonce único
 */
export function generateNonce() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, array));
}

/**
 * Sanitiza HTML para prevenir XSS
 * @param {string} html - HTML a ser sanitizado
 * @returns {string} HTML sanitizado
 */
export function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Valida se uma URL é segura
 * @param {string} url - URL a ser validada
 * @returns {boolean}
 */
export function isSecureURL(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' || 
           urlObj.protocol === 'http:' && urlObj.hostname === 'localhost';
  } catch {
    return false;
  }
}

/**
 * Criptografa dados antes de armazenar
 * @param {string} data - Dados a serem criptografados
 * @param {string} key - Chave de criptografia
 * @returns {string} Dados criptografados em base64
 */
export async function encryptData(data, key) {
  // Implementação simplificada - em produção usar Web Crypto API completa
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const keyBuffer = encoder.encode(key);
  
  // XOR simples (substituir por AES-GCM em produção)
  const encrypted = new Uint8Array(dataBuffer.length);
  for (let i = 0; i < dataBuffer.length; i++) {
    encrypted[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  }
  
  return btoa(String.fromCharCode.apply(null, encrypted));
}

/**
 * Descriptografa dados armazenados
 * @param {string} encryptedData - Dados criptografados em base64
 * @param {string} key - Chave de criptografia
 * @returns {string} Dados descriptografados
 */
export async function decryptData(encryptedData, key) {
  try {
    const encrypted = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const encoder = new TextEncoder();
    const keyBuffer = encoder.encode(key);
    
    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ keyBuffer[i % keyBuffer.length];
    }
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch {
    return null;
  }
}

/**
 * Armazena dados de forma segura no sessionStorage
 * @param {string} key - Chave de armazenamento
 * @param {any} data - Dados a serem armazenados
 */
export async function secureStore(key, data) {
  const sessionKey = getSessionKey();
  const jsonData = JSON.stringify(data);
  const encrypted = await encryptData(jsonData, sessionKey);
  sessionStorage.setItem(key, encrypted);
}

/**
 * Recupera dados do sessionStorage de forma segura
 * @param {string} key - Chave de armazenamento
 * @returns {any} Dados descriptografados
 */
export async function secureRetrieve(key) {
  const encrypted = sessionStorage.getItem(key);
  if (!encrypted) return null;
  
  const sessionKey = getSessionKey();
  const decrypted = await decryptData(encrypted, sessionKey);
  if (!decrypted) return null;
  
  try {
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

/**
 * Gera ou recupera chave de sessão
 * @returns {string} Chave da sessão
 */
function getSessionKey() {
  let key = sessionStorage.getItem('_sk');
  if (!key) {
    key = generateNonce();
    sessionStorage.setItem('_sk', key);
  }
  return key;
}

/**
 * Limpa dados sensíveis
 */
export function clearSecureData() {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('cart');
  sessionStorage.removeItem('_sk');
}

/**
 * Rate limiting simples
 */
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    // Remove requisições antigas
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  reset(key) {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter(10, 60000); // 10 req/min
