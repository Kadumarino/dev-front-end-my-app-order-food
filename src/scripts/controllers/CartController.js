// ===============================================
// CONTROLLER: CartController
// Gerencia lógica do carrinho
// ===============================================

class CartController {
  constructor(store) {
    this.store = store;
  }

  /**
   * Inicializa o controller
   */
  init() {
    this.setupEventListeners();
    this.subscribeToStore();
    this.renderCart();
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
    }
  }

  /**
   * Inscreve-se para mudanças no store
   */
  subscribeToStore() {
    this.store.subscribe(() => {
      this.renderCart();
    });
  }

  /**
   * Renderiza carrinho na tela
   */
  renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (!cartItemsContainer || !totalElement) return;

    const cart = this.store.getState().cart;
    const total = this.store.getCartTotal();

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<li class="empty-cart">🛒 Carrinho vazio</li>';
      totalElement.textContent = 'Total: R$ 0,00';
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    cartItemsContainer.innerHTML = cart.map((item, index) => 
      this.createCartItemHTML(item, index)
    ).join('');

    totalElement.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    if (checkoutBtn) checkoutBtn.disabled = false;

    // Adicionar event listeners
    cart.forEach((item, index) => {
      const removeBtn = document.getElementById(`remove-${index}`);
      if (removeBtn) {
        removeBtn.addEventListener('click', () => this.removeItem(item.id));
      }

      const decreaseBtn = document.getElementById(`decrease-${index}`);
      if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => this.decreaseQuantity(item.id));
      }

      const increaseBtn = document.getElementById(`increase-${index}`);
      if (increaseBtn) {
        increaseBtn.addEventListener('click', () => this.increaseQuantity(item.id));
      }
    });
  }

  /**
   * Cria HTML de item do carrinho
   * @param {CartItem} item
   * @param {number} index
   * @returns {string}
   */
  createCartItemHTML(item, index) {
    return `
      <li class="cart-item">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <span class="cart-item-price">${item.getFormattedPrice()}</span>
          ${item.selectedExtras.length > 0 ? `
            <div class="cart-extras">
              <small>+ ${item.selectedExtras.length} adicional(is)</small>
            </div>
          ` : ''}
          ${item.observation ? `
            <div class="cart-observation">
              <small>Obs: ${sanitizeText(item.observation)}</small>
            </div>
          ` : ''}
        </div>
        <div class="cart-item-actions">
          <div class="quantity-controls">
            <button class="btn-icon" id="decrease-${index}">−</button>
            <span class="quantity">${item.quantity}</span>
            <button class="btn-icon" id="increase-${index}">+</button>
          </div>
          <button class="btn-icon remove-btn" id="remove-${index}">🗑️</button>
        </div>
        <div class="cart-item-subtotal">
          Subtotal: ${item.getFormattedSubtotal()}
        </div>
      </li>
    `;
  }

  /**
   * Remove item do carrinho
   * @param {string} itemId
   */
  removeItem(itemId) {
    if (confirm('Remover este item do carrinho?')) {
      this.store.removeFromCart(itemId);
    }
  }

  /**
   * Diminui quantidade de item
   * @param {string} itemId
   */
  decreaseQuantity(itemId) {
    const item = this.store.getState().cart.find(item => item.id === itemId);
    if (item) {
      if (item.quantity > 1) {
        this.store.updateCartItemQuantity(itemId, item.quantity - 1);
      } else {
        this.removeItem(itemId);
      }
    }
  }

  /**
   * Aumenta quantidade de item
   * @param {string} itemId
   */
  increaseQuantity(itemId) {
    const item = this.store.getState().cart.find(item => item.id === itemId);
    if (item) {
      if (item.quantity < CONFIG.security.maxItemQuantity) {
        this.store.updateCartItemQuantity(itemId, item.quantity + 1);
      } else {
        alert(`Quantidade máxima: ${CONFIG.security.maxItemQuantity} unidades`);
      }
    }
  }

  /**
   * Procede para checkout
   */
  proceedToCheckout() {
    const cart = this.store.getState().cart;
    
    if (cart.length === 0) {
      alert('🛒 Adicione itens ao carrinho primeiro!');
      return;
    }

    // Validar total mínimo
    const total = this.store.getCartTotal();
    if (total < CONFIG.delivery.minimumOrder) {
      alert(`Pedido mínimo: R$ ${CONFIG.delivery.minimumOrder.toFixed(2).replace('.', ',')}`);
      return;
    }

    // Redirecionar para página de entrega
    window.location.href = 'entrega.html';
  }

  /**
   * Limpa carrinho
   */
  clearCart() {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      this.store.clearCart();
    }
  }
}
