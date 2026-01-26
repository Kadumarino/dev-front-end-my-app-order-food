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

    // Verificar horário e exibir modal de confirmação
    this.showScheduleConfirmationModal();
  }

  /**
   * Exibe modal de confirmação de agendamento
   */
  showScheduleConfirmationModal() {
    const isOpen = this.checkBusinessHours();
    
    if (isOpen) {
      // Se estiver aberto, vai direto para entrega
      window.location.href = 'entrega.html';
      return;
    }

    // Calcular próximo horário de atendimento
    const scheduleInfo = this.getNextAvailableTime();
    
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'schedule-modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 500px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 48px; margin-bottom: 10px;">🕒</div>
          <h2 style="margin: 0 0 10px; color: #333;">Horário de Atendimento</h2>
        </div>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px; font-weight: 600; color: #333;">📅 Horários de funcionamento:</p>
          <ul style="margin: 0; padding-left: 20px; color: #666;">
            <li><strong>Sexta-feira:</strong> 18h às 00h</li>
            <li><strong>Sábado:</strong> 15h às 00h</li>
            <li><strong>Domingo:</strong> 15h às 00h</li>
          </ul>
          <p style="margin: 15px 0 0; color: #ff9800; font-weight: 600;">
            ⚠️ De segunda a quinta não atendemos
          </p>
        </div>

        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ff9800; margin-bottom: 20px;">
          <p style="margin: 0; color: #856404; font-weight: 500;">
            📦 Seu pedido será <strong>agendado para ${scheduleInfo}</strong>
          </p>
        </div>

        <label style="display: flex; align-items: start; gap: 10px; margin-bottom: 20px; cursor: pointer; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 2px solid #dee2e6;">
          <input type="checkbox" id="accept-schedule" style="margin-top: 3px; width: 18px; height: 18px; cursor: pointer;">
          <span style="font-size: 14px; color: #495057; line-height: 1.5;">
            Eu entendo e aceito que meu pedido será entregue apenas no próximo horário de atendimento.
          </span>
        </label>

        <div style="display: flex; gap: 10px;">
          <button id="cancel-schedule" class="btn-secondary" style="flex: 1;">
            Cancelar
          </button>
          <button id="confirm-schedule" class="btn-primary" style="flex: 1; opacity: 0.5;" disabled>
            Confirmar Pedido
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    const checkbox = document.getElementById('accept-schedule');
    const confirmBtn = document.getElementById('confirm-schedule');
    const cancelBtn = document.getElementById('cancel-schedule');
    
    checkbox.addEventListener('change', (e) => {
      confirmBtn.disabled = !e.target.checked;
      confirmBtn.style.opacity = e.target.checked ? '1' : '0.5';
      confirmBtn.style.cursor = e.target.checked ? 'pointer' : 'not-allowed';
    });
    
    confirmBtn.addEventListener('click', () => {
      if (checkbox.checked) {
        // Salvar informação de agendamento
        localStorage.setItem('scheduledOrder', JSON.stringify({
          scheduled: true,
          deliveryTime: scheduleInfo,
          timestamp: new Date().toISOString()
        }));
        modal.remove();
        window.location.href = 'entrega.html';
      }
    });
    
    cancelBtn.addEventListener('click', () => {
      modal.remove();
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  /**
   * Verifica horário de funcionamento
   */
  checkBusinessHours() {
    // Obter horário de Brasília (UTC-3)
    const now = new Date();
    const brasiliaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    
    const day = brasiliaTime.getDay();
    const hours = brasiliaTime.getHours();
    const minutes = brasiliaTime.getMinutes();
    const currentTime = hours * 60 + minutes;

    // Debug: descomentar para testar
    // console.log('CartController - Debug horário Brasília:', { day, hours, minutes, currentTime, date: brasiliaTime.toString() });

    let isOpen = false;

    if (day === 5) {
      // Sexta: 18:00 às 00:00
      isOpen = currentTime >= (18 * 60); // 1080 minutos
    } else if (day === 6) {
      // Sábado: 15:00 às 00:00
      isOpen = currentTime >= (15 * 60); // 900 minutos
    } else if (day === 0) {
      // Domingo: 15:00 às 00:00
      isOpen = currentTime >= (15 * 60); // 900 minutos
    }

    return isOpen;
  }

  /**
   * Retorna próximo horário disponível
   */
  getNextAvailableTime() {
    // Obter horário de Brasília
    const now = new Date();
    const brasiliaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    
    const day = brasiliaTime.getDay();
    const hours = brasiliaTime.getHours();
    
    // Se for sexta e antes das 18h
    if (day === 5 && hours < 18) {
      return 'hoje às 18h';
    }
    
    // Se for sábado e antes das 15h
    if (day === 6 && hours < 15) {
      return 'hoje às 15h';
    }
    
    // Se for domingo e antes das 15h
    if (day === 0 && hours < 15) {
      return 'hoje às 15h';
    }
    
    // Calcular próxima sexta
    let daysUntilFriday = (5 - day + 7) % 7;
    if (daysUntilFriday === 0) daysUntilFriday = 7;
    
    if (daysUntilFriday === 1) {
      return 'amanhã às 18h';
    } else if (daysUntilFriday === 2) {
      return 'sexta-feira às 18h';
    } else {
      return `próxima sexta-feira às 18h`;
    }
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
