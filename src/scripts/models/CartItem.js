// ===============================================
// MODEL: CartItem
// Representa um item no carrinho
// ===============================================

class CartItem {
  constructor(data) {
    this.id = data.id; // ID único do item no carrinho
    this.menuItemId = data.menuItemId;
    this.name = data.name;
    this.price = data.price;
    this.quantity = data.quantity || 1;
    this.selectedExtras = data.selectedExtras || [];
    this.observation = data.observation || '';
    this.customizedPrice = data.customizedPrice || data.price;
  }

  /**
   * Calcula subtotal do item
   * @returns {number}
   */
  getSubtotal() {
    return this.customizedPrice * this.quantity;
  }

  /**
   * Aumenta quantidade
   */
  incrementQuantity() {
    this.quantity++;
  }

  /**
   * Diminui quantidade
   */
  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  /**
   * Define quantidade
   * @param {number} quantity
   */
  setQuantity(quantity) {
    if (quantity > 0 && quantity <= CONFIG.security.maxItemQuantity) {
      this.quantity = quantity;
    }
  }

  /**
   * Formata preço para exibição
   * @returns {string}
   */
  getFormattedPrice() {
    return `R$ ${this.customizedPrice.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Formata subtotal para exibição
   * @returns {string}
   */
  getFormattedSubtotal() {
    return `R$ ${this.getSubtotal().toFixed(2).replace('.', ',')}`;
  }

  /**
   * Converte para objeto simples
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      menuItemId: this.menuItemId,
      name: this.name,
      price: this.price,
      quantity: this.quantity,
      selectedExtras: this.selectedExtras,
      observation: this.observation,
      customizedPrice: this.customizedPrice
    };
  }

  /**
   * Cria instância a partir de objeto
   * @param {Object} data
   * @returns {CartItem}
   */
  static fromJSON(data) {
    return new CartItem(data);
  }
}
