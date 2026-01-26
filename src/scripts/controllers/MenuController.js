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
        <img src="${item.image}" alt="${item.name}" loading="lazy">
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
   */
  addToCart(item, selectedExtras = [], observation = '') {
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
        customizedPrice: customizedPrice
      });

      this.store.addToCart(cartItem);
      
      // Feedback visual
      this.showNotification('✅ Item adicionado ao carrinho!');
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
      
      this.addToCart(item, selectedExtras, observation);
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
          <button class="close-modal" onclick="menuController.closeCustomizeModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="price" id="customize-price"></div>
          <h3>Adicionais:</h3>
          <div id="customize-extras"></div>
          <h3>Observações:</h3>
          <textarea id="customize-observation" placeholder="Alguma observação especial?"></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="menuController.closeCustomizeModal()">Cancelar</button>
          <button class="btn-primary" id="confirm-customize">Confirmar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  /**
   * Fecha modal de customização
   */
  closeCustomizeModal() {
    const modal = document.getElementById('customize-modal');
    if (modal) {
      modal.style.display = 'none';
      document.getElementById('customize-observation').value = '';
      document.querySelectorAll('input[name="extra"]').forEach(input => input.checked = false);
    }
  }

  /**
   * Mostra notificação temporária
   * @param {string} message
   */
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
}
