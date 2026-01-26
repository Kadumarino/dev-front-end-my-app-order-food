/**
 * Storage Migration Layer - Kadu Lanches
 * Migração transparente de localStorage para sessionStorage seguro
 */

import {
  secureStore,
  secureRetrieve,
  clearSecureData,
} from './security-enhanced.js';

// Chave de criptografia (em produção, deve vir de variável de ambiente)
const STORAGE_KEY = 'kadu-lanches-v1';

/**
 * Store API compatível com localStorage mas usando sessionStorage seguro
 */
export const store = {
  /**
   * Armazena um item de forma segura
   * @param {string} key - Chave do item
   * @param {*} value - Valor (será convertido para JSON automaticamente)
   */
  async setItem(key, value) {
    try {
      const data = typeof value === 'string' ? value : JSON.stringify(value);
      await secureStore(key, data, STORAGE_KEY);
    } catch (error) {
      console.error(`[Store] Erro ao salvar ${key}:`, error);
      // Fallback para localStorage em caso de erro
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  },

  /**
   * Recupera um item de forma segura
   * @param {string} key - Chave do item
   * @param {*} defaultValue - Valor padrão se não encontrar
   * @returns {*} Valor recuperado ou valor padrão
   */
  async getItem(key, defaultValue = null) {
    try {
      const data = await secureRetrieve(key, STORAGE_KEY);
      return data !== null ? data : defaultValue;
    } catch (error) {
      console.error(`[Store] Erro ao recuperar ${key}:`, error);
      // Fallback para localStorage
      const fallback = localStorage.getItem(key);
      return fallback !== null ? fallback : defaultValue;
    }
  },

  /**
   * Remove um item específico
   * @param {string} key - Chave do item
   */
  removeItem(key) {
    try {
      sessionStorage.removeItem(key);
      // Também remove do localStorage antigo
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[Store] Erro ao remover ${key}:`, error);
    }
  },

  /**
   * Limpa todos os dados armazenados
   */
  clear() {
    try {
      clearSecureData();
      // Também limpa localStorage antigo (exceto tema)
      const theme = localStorage.getItem('theme');
      localStorage.clear();
      if (theme) {
        localStorage.setItem('theme', theme);
      }
    } catch (error) {
      console.error('[Store] Erro ao limpar dados:', error);
    }
  },

  /**
   * Migra dados do localStorage antigo para sessionStorage seguro
   * Deve ser chamado ao carregar a aplicação
   */
  async migrate() {
    const keysToMigrate = ['cart', 'user', 'payment', 'scheduledOrder'];

    for (const key of keysToMigrate) {
      try {
        const oldValue = localStorage.getItem(key);
        if (oldValue !== null) {
          await this.setItem(key, oldValue);
          console.log(`[Store] Migrado: ${key}`);
        }
      } catch (error) {
        console.error(`[Store] Erro ao migrar ${key}:`, error);
      }
    }

    console.log('[Store] Migração concluída');
  },
};

/**
 * Store síncrono para compatibilidade com código legado
 * ATENÇÃO: Usa sessionStorage sem criptografia
 */
export const syncStore = {
  setItem(key, value) {
    try {
      const data = typeof value === 'string' ? value : JSON.stringify(value);
      sessionStorage.setItem(key, data);
    } catch (error) {
      console.error(`[SyncStore] Erro ao salvar ${key}:`, error);
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  },

  getItem(key, defaultValue = null) {
    try {
      const data = sessionStorage.getItem(key);
      return data !== null ? data : defaultValue;
    } catch (error) {
      console.error(`[SyncStore] Erro ao recuperar ${key}:`, error);
      const fallback = localStorage.getItem(key);
      return fallback !== null ? fallback : defaultValue;
    }
  },

  removeItem(key) {
    try {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[SyncStore] Erro ao remover ${key}:`, error);
    }
  },

  clear() {
    try {
      sessionStorage.clear();
      const theme = localStorage.getItem('theme');
      localStorage.clear();
      if (theme) {
        localStorage.setItem('theme', theme);
      }
    } catch (error) {
      console.error('[SyncStore] Erro ao limpar dados:', error);
    }
  },
};

/**
 * Utilitário para dados sensíveis (ex: dados do usuário)
 */
export const secureStorage = {
  async saveUser(userData) {
    await store.setItem('user', userData);
  },

  async getUser() {
    const data = await store.getItem('user', 'null');
    return data === 'null' ? null : JSON.parse(data);
  },

  async saveCart(cartItems) {
    await store.setItem('cart', cartItems);
  },

  async getCart() {
    const data = await store.getItem('cart', '[]');
    return JSON.parse(data);
  },

  async savePayment(paymentData) {
    await store.setItem('payment', paymentData);
  },

  async getPayment() {
    const data = await store.getItem('payment', 'null');
    return data === 'null' ? null : JSON.parse(data);
  },

  async clearAll() {
    store.clear();
  },
};

/**
 * Tema (pode continuar no localStorage por ser não-sensível e persistente)
 */
export const themeStorage = {
  get() {
    return localStorage.getItem('theme') || 'light';
  },

  set(theme) {
    localStorage.setItem('theme', theme);
  },

  toggle() {
    const current = this.get();
    const next = current === 'dark' ? 'light' : 'dark';
    this.set(next);
    return next;
  },
};

// Exporta também a instância global
export default store;
