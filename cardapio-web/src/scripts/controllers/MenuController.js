// ===============================================
// CONTROLLER: MenuController
// Gerencia lógica do cardápio
// ===============================================

class MenuController {
  constructor(menuAPI, store) {
    this.menuAPI = menuAPI;
    this.store = store;
    this.currentCategory = 'lanches';
    this.isMenuVisible = true;
  }

  /**
   * Inicializa o controller
   */
  async init() {
    try {
      await this.loadMenu();
      this.setupEventListeners();
      this.renderMenu();
    } catch (error) {
      console.error('Erro ao inicializar menu:', error);
      alert('❌ Erro ao carregar cardápio. Tente novamente.');
    }
  }

  /**
   * Carrega itens do menu
   */
  async loadMenu() {
    const items = await this.menuAPI.getAllItems();
    this.store.setMenuItems(items);
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Tabs de categoria
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        const isCurrentCategory = category === this.currentCategory;
        
        // Se clicar na categoria ativa, alternar visibilidade
        if (isCurrentCategory && btn.classList.contains('active')) {
          this.toggleMenuVisibility();
        } else {
          // Trocar para outra categoria
          this.isMenuVisible = true;
          this.filterByCategory(category);
          
          // Atualizar UI das tabs
          tabBtns.forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
        }
      });
    });
  }

  /**
   * Alterna visibilidade do menu
   */
  toggleMenuVisibility() {
    this.isMenuVisible = !this.isMenuVisible;
    const menuContainer = document.getElementById('menu');
    
    if (menuContainer) {
      if (this.isMenuVisible) {
        menuContainer.style.display = 'grid';
        this.renderMenu();
      } else {
        menuContainer.style.display = 'none';
      }
    }
  }

  /**
   * Filtra menu por categoria
   * @param {string} category
   */
  filterByCategory(category) {
    this.currentCategory = category;
    this.store.setCurrentCategory(category);
    this.renderMenu();
  }

  /**
   * Renderiza menu na tela
   */
  renderMenu() {
    const menuContainer = document.getElementById('menu');
    if (!menuContainer) return;

    const items = this.store.getMenuItemsByCategory(this.currentCategory);
    
    menuContainer.innerHTML = items.map(item => this.createMenuItemHTML(item)).join('');
    
    // Adicionar event listeners nos botões
    items.forEach(item => {
      const btn = document.getElementById(`add-${item.id}`);
      if (btn) {
        btn.addEventListener('click', () => this.handleAddToCart(item));
      }
    });
  }

  /**
   * Cria HTML de um item do menu
   * @param {MenuItem} item
   * @returns {string}
   */
  createMenuItemHTML(item) {
    const hasExtras = item.extras && item.extras.length > 0;
    const buttonText = hasExtras ? '+ Personalizar' : '+ Adicionar';
    
    return `
      <div class="item">
        <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="price">${item.getFormattedPrice()}</div>
        <button id="add-${item.id}" ${!item.isAvailable() ? 'disabled' : ''}>
          ${item.isAvailable() ? buttonText : '❌ Indisponível'}
        </button>
      </div>
    `;
  }

  /**
   * Manipula adição de item ao carrinho
   * @param {MenuItem} item
   */
  handleAddToCart(item) {
    if (item.extras && item.extras.length > 0) {
      this.showCustomizeModal(item);
    } else {
      this.addToCart(item);
    }
  }

  /**
   * Adiciona item ao carrinho
   * @param {MenuItem} item
   * @param {Array} selectedExtras
   * @param {string} observation
   * @param {string} personName
   */
  addToCart(item, selectedExtras = [], observation = '', personName = '') {
    try {
      const customizedPrice = item.calculatePriceWithExtras(selectedExtras);
      
      const cartItem = new CartItem({
        id: `cart-${Date.now()}-${Math.random()}`,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        selectedExtras: selectedExtras,
        observation: observation,
        customizedPrice: customizedPrice,
        personName: personName
      });

      this.store.addToCart(cartItem);
      
      // Feedback visual
      this.showNotification('Item adicionado ao carrinho!');
    } catch (error) {
      alert(error.message);
    }
  }

  /**
   * Mostra modal de customização
   * @param {MenuItem} item
   */
  showCustomizeModal(item) {
    const modal = document.getElementById('customize-modal');
    if (!modal) {
      this.createCustomizeModal();
      return this.showCustomizeModal(item);
    }

    modal.style.display = 'flex';
    modal.dataset.itemId = item.id;

    // Renderizar conteúdo
    document.getElementById('customize-title').textContent = item.name;
    document.getElementById('customize-price').textContent = item.getFormattedPrice();
    
    const extrasContainer = document.getElementById('customize-extras');
    extrasContainer.innerHTML = item.extras.map(extra => `
      <label class="extra-option">
        <input type="checkbox" name="extra" value="${extra.id}" data-price="${extra.price}">
        ${extra.name} (+R$ ${extra.price.toFixed(2).replace('.', ',')})
      </label>
    `).join('');

    // Event listener para confirmar
    const confirmBtn = document.getElementById('confirm-customize');
    confirmBtn.onclick = () => {
      const selectedExtras = Array.from(document.querySelectorAll('input[name="extra"]:checked'))
        .map(input => input.value);
      const observation = document.getElementById('customize-observation').value;
      const personNameRaw = document.getElementById('customize-person-name').value.trim();
      
      // Capitaliza primeira letra de cada palavra
      const personName = personNameRaw
        .split(' ')
        .map(word => word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '')
        .filter(word => word.length > 0)
        .join(' ');
      
      this.addToCart(item, selectedExtras, observation, personName);
      this.closeCustomizeModal();
    };
  }

  /**
   * Cria modal de customização
   */
  createCustomizeModal() {
    const modal = document.createElement('div');
    modal.id = 'customize-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="customize-title"></h2>
          <button class="close-modal" id="close-modal-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="price" id="customize-price"></div>
          <h3>Para quem é o pedido?</h3>
          <input type="text" id="customize-person-name" placeholder="Nome da pessoa (opcional)" maxlength="50" autocomplete="off">
          <h3>Adicionais:</h3>
          <div id="customize-extras"></div>
          <h3>Observações:</h3>
          <textarea id="customize-observation" placeholder="Alguma observação especial?"></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" id="cancel-customize-btn">Cancelar</button>
          <button class="btn-primary" id="confirm-customize">Confirmar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Adicionar event listeners para fechar modal
    const closeBtn = modal.querySelector('#close-modal-btn');
    const cancelBtn = modal.querySelector('#cancel-customize-btn');
    
    closeBtn.addEventListener('click', () => this.closeCustomizeModal());
    cancelBtn.addEventListener('click', () => this.closeCustomizeModal());
    
    // Fechar ao clicar fora do modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeCustomizeModal();
      }
    });
    
    // Capitalização automática em tempo real no campo de nome
    const personNameInput = modal.querySelector('#customize-person-name');
    personNameInput.addEventListener('input', (e) => {
      const cursorPosition = e.target.selectionStart;
      const oldValue = e.target.value;
      
      const newValue = oldValue
        .split(' ')
        .map(word => word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '')
        .join(' ');
      
      if (newValue !== oldValue) {
        e.target.value = newValue;
        // Restaura posição do cursor
        e.target.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  }

  /**
   * Fecha modal de customização
   */
  closeCustomizeModal() {
    const modal = document.getElementById('customize-modal');
    if (modal) {
      modal.style.display = 'none';
      modal.removeAttribute('data-item-id');
      modal.removeAttribute('data-cart-item-id');
      modal.removeAttribute('data-edit-mode');
      document.getElementById('customize-observation').value = '';
      document.getElementById('customize-person-name').value = '';
      document.querySelectorAll('input[name="extra"]').forEach(input => input.checked = false);
    }
  }

  /**
   * Abre modal para editar item do carrinho
   * @param {MenuItem} menuItem
   * @param {CartItem} cartItem
   */
  openEditModal(menuItem, cartItem) {
    const modal = document.getElementById('customize-modal');
    if (!modal) {
      this.createCustomizeModal();
      return this.openEditModal(menuItem, cartItem);
    }

    modal.style.display = 'flex';
    modal.dataset.itemId = menuItem.id;
    modal.dataset.cartItemId = cartItem.id;
    modal.dataset.editMode = 'true';

    // Renderizar conteúdo
    document.getElementById('customize-title').textContent = `Editar: ${menuItem.name}`;
    document.getElementById('customize-price').textContent = menuItem.getFormattedPrice();
    
    const extrasContainer = document.getElementById('customize-extras');
    extrasContainer.innerHTML = menuItem.extras.map(extra => {
      const isSelected = cartItem.selectedExtras.includes(extra.id);
      return `
        <label class="extra-option">
          <input type="checkbox" name="extra" value="${extra.id}" data-price="${extra.price}" ${isSelected ? 'checked' : ''}>
          ${extra.name} (+R$ ${extra.price.toFixed(2).replace('.', ',')})
        </label>
      `;
    }).join('');

    // Preencher observação
    document.getElementById('customize-observation').value = cartItem.observation || '';
    
    // Preencher nome da pessoa
    document.getElementById('customize-person-name').value = cartItem.personName || '';

    // Event listener para confirmar edição
    const confirmBtn = document.getElementById('confirm-customize');
    confirmBtn.onclick = () => {
      const selectedExtras = Array.from(document.querySelectorAll('input[name="extra"]:checked'))
        .map(input => input.value);
      const observation = document.getElementById('customize-observation').value;
      const personNameRaw = document.getElementById('customize-person-name').value.trim();
      
      // Capitaliza primeira letra de cada palavra
      const personName = personNameRaw
        .split(' ')
        .map(word => word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '')
        .filter(word => word.length > 0)
        .join(' ');
      
      // Calcular novo preço
      const customizedPrice = menuItem.calculatePriceWithExtras(selectedExtras);
      
      // Atualizar item no carrinho
      this.store.updateCartItem(cartItem.id, {
        selectedExtras: selectedExtras,
        observation: observation,
        customizedPrice: customizedPrice,
        personName: personName
      });
      
      this.closeCustomizeModal();
      this.showNotification('Item atualizado no carrinho!');
    };
  }

  /**
   * Mostra notificação temporária
   * @param {string} message
   */
  showNotification(message) {
    // Garante que o container existe
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    notification.className = 'notification notification-success';
    notification.innerHTML = `
      <span class="notification-icon">✅</span>
      <span class="notification-message">${message}</span>
    `;
    
    container.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
}
