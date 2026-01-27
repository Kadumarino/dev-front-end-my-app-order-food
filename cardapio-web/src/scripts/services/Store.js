// ===============================================
// SERVICE: Store
// Gerenciamento de estado centralizado
// ===============================================

class Store {
  constructor() {
    this.state = {
      cart: [],
      user: null,
      payment: null,
      menuItems: [],
      currentCategory: 'lanches',
      theme: 'light'
    };
    
    this.listeners = [];
    this.loadFromStorage();
  }

  /**
   * Carrega estado do localStorage
   */
  loadFromStorage() {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      this.state.cart = cart.map(item => CartItem.fromJSON(item));

      const user = JSON.parse(localStorage.getItem('user') || 'null');
      this.state.user = user ? User.fromJSON(user) : null;

      const payment = JSON.parse(localStorage.getItem('payment') || 'null');
      this.state.payment = payment ? Payment.fromJSON(payment) : null;

      this.state.theme = localStorage.getItem('theme') || 'light';
    } catch (error) {
      console.error('Erro ao carregar estado:', error);
    }
  }

  /**
   * Salva estado no localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('cart', JSON.stringify(this.state.cart.map(item => item.toJSON())));
      localStorage.setItem('user', JSON.stringify(this.state.user?.toJSON() || null));
      localStorage.setItem('payment', JSON.stringify(this.state.payment?.toJSON() || null));
      localStorage.setItem('theme', this.state.theme);
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
    }
  }

  /**
   * Obtém estado atual
   * @returns {Object}
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Inscreve listener para mudanças de estado
   * @param {Function} listener
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notifica todos os listeners
   */
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // ===============================================
  // CART ACTIONS
  // ===============================================

  /**
   * Adiciona item ao carrinho
   * @param {CartItem} item
   */
  addToCart(item) {
    if (this.state.cart.length >= CONFIG.security.maxCartItems) {
      throw new Error(`Máximo de ${CONFIG.security.maxCartItems} itens no carrinho`);
    }

    this.state.cart.push(item);
    this.saveToStorage();
    this.notify();
  }

  /**
   * Remove item do carrinho
   * @param {string} itemId
   */
  removeFromCart(itemId) {
    this.state.cart = this.state.cart.filter(item => item.id !== itemId);
    this.saveToStorage();
    this.notify();
  }

  /**
   * Atualiza quantidade de item
   * @param {string} itemId
   * @param {number} quantity
   */
  updateCartItemQuantity(itemId, quantity) {
    const item = this.state.cart.find(item => item.id === itemId);
    if (item) {
      item.setQuantity(quantity);
      this.saveToStorage();
      this.notify();
    }
  }

  /**
   * Atualiza item completo do carrinho
   * @param {string} itemId
   * @param {Object} updates - Objeto com campos a atualizar
   */
  updateCartItem(itemId, updates) {
    const index = this.state.cart.findIndex(item => item.id === itemId);
    if (index !== -1) {
      const item = this.state.cart[index];
      
      // Atualizar campos
      if (updates.quantity !== undefined) item.quantity = updates.quantity;
      if (updates.selectedExtras !== undefined) item.selectedExtras = updates.selectedExtras;
      if (updates.observation !== undefined) item.observation = updates.observation;
      if (updates.customizedPrice !== undefined) item.customizedPrice = updates.customizedPrice;
      if (updates.personName !== undefined) item.personName = updates.personName;
      
      this.saveToStorage();
      this.notify();
    }
  }

  /**
   * Limpa carrinho
   */
  clearCart() {
    this.state.cart = [];
    this.saveToStorage();
    this.notify();
  }

  /**
   * Calcula total do carrinho
   * @returns {number}
   */
  getCartTotal() {
    return this.state.cart.reduce((sum, item) => sum + item.getSubtotal(), 0);
  }

  /**
   * Retorna quantidade de itens no carrinho
   * @returns {number}
   */
  getCartItemCount() {
    return this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // ===============================================
  // USER ACTIONS
  // ===============================================

  /**
   * Define dados do usuário
   * @param {User} user
   */
  setUser(user) {
    this.state.user = user;
    this.saveToStorage();
    this.notify();
  }

  /**
   * Obtém usuário
   * @returns {User|null}
   */
  getUser() {
    return this.state.user;
  }

  /**
   * Limpa dados do usuário
   */
  clearUser() {
    this.state.user = null;
    this.saveToStorage();
    this.notify();
  }

  // ===============================================
  // PAYMENT ACTIONS
  // ===============================================

  /**
   * Define forma de pagamento
   * @param {Payment} payment
   */
  setPayment(payment) {
    this.state.payment = payment;
    this.saveToStorage();
    this.notify();
  }

  /**
   * Obtém forma de pagamento
   * @returns {Payment|null}
   */
  getPayment() {
    return this.state.payment;
  }

  /**
   * Limpa forma de pagamento
   */
  clearPayment() {
    this.state.payment = null;
    this.saveToStorage();
    this.notify();
  }

  // ===============================================
  // MENU ACTIONS
  // ===============================================

  /**
   * Define itens do menu
   * @param {Array<MenuItem>} items
   */
  setMenuItems(items) {
    this.state.menuItems = items;
    this.notify();
  }

  /**
   * Filtra itens por categoria
   * @param {string} category
   * @returns {Array<MenuItem>}
   */
  getMenuItemsByCategory(category) {
    return this.state.menuItems.filter(item => item.category === category);
  }

  /**
   * Define categoria atual
   * @param {string} category
   */
  setCurrentCategory(category) {
    this.state.currentCategory = category;
    this.notify();
  }

  // ===============================================
  // THEME ACTIONS
  // ===============================================

  /**
   * Define tema
   * @param {string} theme - 'light' ou 'dark'
   */
  setTheme(theme) {
    this.state.theme = theme;
    document.body.classList.toggle('dark-mode', theme === 'dark');
    this.saveToStorage();
    this.notify();
  }

  /**
   * Alterna tema
   */
  toggleTheme() {
    const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Obtém tema atual
   * @returns {string}
   */
  getTheme() {
    return this.state.theme;
  }

  // ===============================================
  // ORDER ACTIONS
  // ===============================================

  /**
   * Finaliza pedido e limpa dados
   */
  completeOrder() {
    this.clearCart();
    this.clearPayment();
    this.notify();
  }
}

// Singleton - Instância única global
const store = new Store();
