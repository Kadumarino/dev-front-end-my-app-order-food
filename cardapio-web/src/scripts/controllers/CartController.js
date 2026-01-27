// ===============================================
// CONTROLLER: CartController
// Gerencia lógica do carrinho
// ===============================================

class CartController {
  constructor(store) {
    this.store = store;
    this.expandedItems = new Set(); // Armazena IDs dos itens expandidos
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
      // Restaurar estado de expansão
      const cartItemElement = document.querySelector(`[data-item-id="${item.id}"]`);
      if (cartItemElement) {
        const isExpanded = this.expandedItems.has(item.id);
        cartItemElement.dataset.collapsed = isExpanded ? 'false' : 'true';
        const icon = cartItemElement.querySelector('.toggle-icon');
        if (icon) {
          icon.textContent = isExpanded ? '▲' : '▼';
        }
      }

      const toggleBtn = document.getElementById(`toggle-${index}`);
      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
          const cartItem = e.currentTarget.closest('.cart-item');
          const isCollapsed = cartItem.dataset.collapsed === 'true';
          const icon = cartItem.querySelector('.toggle-icon');
          
          cartItem.dataset.collapsed = !isCollapsed;
          icon.textContent = isCollapsed ? '▲' : '▼';
          
          // Atualizar set de itens expandidos
          if (!isCollapsed) {
            this.expandedItems.delete(item.id);
          } else {
            this.expandedItems.add(item.id);
          }
        });
      }

      const editBtn = document.getElementById(`edit-${index}`);
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // Impede que o clique expanda/recolha o item
          this.editItem(item);
        });
      }

      const removeBtn = document.getElementById(`remove-${index}`);
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // Impede que o clique expanda/recolha o item
          this.removeItem(item.id);
        });
      }

      const decreaseBtn = document.getElementById(`decrease-${index}`);
      if (decreaseBtn) {
        decreaseBtn.addEventListener('click', (e) => {
          console.log('🔽 DECREASE clicked - item:', item.id, 'index:', index);
          e.stopPropagation(); // Impede que o clique recolha o item
          this.decreaseQuantity(item.id);
        });
      }

      const increaseBtn = document.getElementById(`increase-${index}`);
      if (increaseBtn) {
        increaseBtn.addEventListener('click', (e) => {
          console.log('🔼 INCREASE clicked - item:', item.id, 'index:', index);
          e.stopPropagation(); // Impede que o clique recolha o item
          this.increaseQuantity(item.id);
        });
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
    // Buscar detalhes dos extras selecionados
    let extrasText = '';
    if (item.selectedExtras.length > 0) {
      const menuItem = this.store.getState().menuItems.find(mi => mi.id === item.menuItemId);
      if (menuItem && menuItem.extras) {
        const extrasNames = item.selectedExtras
          .map(extraId => {
            const extra = menuItem.extras.find(e => e.id === extraId);
            return extra ? extra.name : null;
          })
          .filter(name => name);
        
        if (extrasNames.length > 0) {
          extrasText = '+ ' + extrasNames.join(' + ');
        }
      }
    }
    
    // Definir nome a ser exibido no cabeçalho
    const fullName = item.personName || 'Sem Nome';
    const displayName = fullName.length > 12 ? fullName.substring(0, 12) + '...' : fullName;
    
    return `
      <li class="cart-item" data-collapsed="true" data-item-id="${item.id}">
        <div class="cart-item-header">
          <div class="cart-item-summary" id="toggle-${index}">
            <strong class="cart-item-name" title="${fullName}">${displayName} <span class="item-qty">x${item.quantity}</span></strong>
            <span class="toggle-icon">▼</span>
          </div>
          <div class="cart-item-buttons">
            <button class="btn-icon edit-btn" id="edit-${index}" title="Editar item">✏️</button>
            <button class="btn-icon remove-btn" id="remove-${index}" title="Remover item">🗑️</button>
          </div>
        </div>
        <div class="cart-item-details">
          <div class="cart-item-product">📦 ${item.name}</div>
          ${extrasText ? `<div class="cart-extras">${extrasText}</div>` : ''}
          ${item.observation ? `<div class="cart-observation">OBS: ${sanitizeText(item.observation)}</div>` : ''}
          <div class="cart-item-actions">
            <div class="quantity-controls">
              <button class="btn-icon" id="decrease-${index}">−</button>
              <span class="quantity">${item.quantity}</span>
              <button class="btn-icon" id="increase-${index}">+</button>
            </div>
            <div class="cart-item-price-detail">${item.getFormattedSubtotal()}</div>
          </div>
        </div>
      </li>
    `;
  }

  /**
   * Remove item do carrinho
   * @param {string} itemId
   */
  removeItem(itemId) {
    this.store.removeFromCart(itemId);
  }

  /**
   * Edita item do carrinho
   * @param {CartItem} cartItem
   */
  editItem(cartItem) {
    console.log('Editando item:', cartItem);
    
    // Buscar item do menu original
    const menuItem = this.store.getState().menuItems.find(mi => mi.id === cartItem.menuItemId);
    if (!menuItem) {
      alert('Erro: Item não encontrado no cardápio');
      return;
    }

    console.log('MenuItem encontrado:', menuItem);
    console.log('MenuController disponível:', window.menuController);

    // Abrir modal de edição com dados preenchidos
    if (window.menuController) {
      window.menuController.openEditModal(menuItem, cartItem);
    } else {
      alert('Erro: Sistema de edição não está disponível. Recarregue a página.');
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
    
    console.log('🛒 Verificando carrinho:', cart);
    console.log('📊 Quantidade de itens:', cart.length);
    
    if (cart.length === 0) {
      alert('🛒 Adicione itens ao carrinho primeiro!');
      return;
    }

    // Validar total mínimo
    const total = this.store.getCartTotal();
    console.log('💰 Total do carrinho:', total);
    
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
    
    console.log('🕒 Estabelecimento aberto?', isOpen);
    console.log('🛒 Carrinho antes de navegar:', this.store.getState().cart);
    console.log('📦 localStorage cart:', localStorage.getItem('cart'));
    
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
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="schedule-modal-header">
          <div class="schedule-modal-icon">🕒</div>
          <h2 class="schedule-modal-title">Horário de Atendimento</h2>
        </div>
        
        <div class="schedule-info-box">
          <p class="schedule-info-title">📅 Horários de funcionamento:</p>
          <ul class="schedule-hours-list">
            <li><strong>Sexta-feira:</strong> 18h às 00h</li>
            <li><strong>Sábado:</strong> 15h às 00h</li>
            <li><strong>Domingo:</strong> 15h às 00h</li>
          </ul>
          <p class="schedule-closed-warning">
            ⚠️ De segunda a quinta não atendemos
          </p>
        </div>

        <div class="schedule-alert-box">
          <p class="schedule-alert-text">
            📦 Seu pedido será <strong>agendado para ${scheduleInfo}</strong>
          </p>
        </div>

        <label class="schedule-checkbox-label">
          <input type="checkbox" id="accept-schedule" class="schedule-checkbox">
          <span class="schedule-checkbox-text">
            Eu entendo e aceito que meu pedido será entregue apenas no próximo horário de atendimento.
          </span>
        </label>

        <div class="schedule-actions">
          <button id="cancel-schedule" class="btn-secondary">
            Cancelar
          </button>
          <button id="confirm-schedule" class="btn-primary schedule-confirm-btn" disabled>
            Confirmar Pedido
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Mostrar modal
    setTimeout(() => {
      modal.style.display = 'flex';
    }, 10);
    
    // Event listeners
    const checkbox = document.getElementById('accept-schedule');
    const confirmBtn = document.getElementById('confirm-schedule');
    const cancelBtn = document.getElementById('cancel-schedule');
    
    checkbox.addEventListener('change', (e) => {
      confirmBtn.disabled = !e.target.checked;
      if (e.target.checked) {
        confirmBtn.classList.add('enabled');
      } else {
        confirmBtn.classList.remove('enabled');
      }
    });
    
    confirmBtn.addEventListener('click', () => {
      if (checkbox.checked) {
        // Salvar informação de agendamento
        localStorage.setItem('scheduledOrder', JSON.stringify({
          scheduled: true,
          deliveryTime: scheduleInfo,
          timestamp: new Date().toISOString()
        }));
        
        console.log('✅ Pedido agendado, navegando para entrega.html');
        console.log('🛒 Carrinho no localStorage:', localStorage.getItem('cart'));
        
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
