// ===============================================
// CONTROLLER: PaymentController
// Gerencia lógica da página de pagamento
// ===============================================

class PaymentController {
  constructor(store) {
    this.store = store;
    this.selectedMethod = null;
  }

  /**
   * Inicializa o controller
   */
  init() {
    this.validateAccess();
    this.loadPaymentData();
    this.setupEventListeners();
  }

  /**
   * Valida se pode acessar esta página
   */
  validateAccess() {
    const cart = this.store.getState().cart;
    const user = this.store.getUser();

    if (cart.length === 0) {
      alert('🛒 Adicione itens ao carrinho primeiro!');
      window.location.href = 'index.html';
      return;
    }

    if (!user || !user.endereco) {
      alert('📍 Preencha os dados de entrega primeiro!');
      window.location.href = 'entrega.html';
      return;
    }
  }

  /**
   * Carrega dados de pagamento anteriores
   */
  loadPaymentData() {
    const payment = this.store.getPayment();
    if (payment && payment.method) {
      this.selectPaymentMethod(payment.method);
      
      if (payment.method === 'dinheiro' && payment.troco) {
        const trocoInput = document.getElementById('troco');
        if (trocoInput) {
          trocoInput.value = payment.troco;
        }
      }
    }
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Cards de pagamento
    const payCards = document.querySelectorAll('.pay-card');
    payCards.forEach(card => {
      card.addEventListener('click', () => {
        const method = card.dataset.method;
        this.selectPaymentMethod(method);
      });
    });

    // Botão finalizar
    const finishBtn = document.getElementById('finish-order');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => this.finishOrder());
    }
  }

  /**
   * Seleciona método de pagamento
   * @param {string} method
   */
  selectPaymentMethod(method) {
    this.selectedMethod = method;

    // Atualizar UI
    document.querySelectorAll('.pay-card').forEach(card => {
      card.classList.toggle('active', card.dataset.method === method);
    });

    // Renderizar detalhes específicos
    this.renderPaymentDetails(method);
  }

  /**
   * Renderiza detalhes do método de pagamento
   * @param {string} method
   */
  renderPaymentDetails(method) {
    const detailsContainer = document.getElementById('payment-details');
    if (!detailsContainer) return;

    if (method === 'dinheiro') {
      detailsContainer.innerHTML = `
        <div class="form-group">
          <label for="troco">Troco para quanto? (opcional)</label>
          <input type="number" id="troco" min="0" step="0.01" placeholder="Ex: 50,00">
        </div>
      `;
    } else {
      detailsContainer.innerHTML = `
        <div class="payment-info">
          <p>✅ A maquininha estará disponível na entrega.</p>
        </div>
      `;
    }
  }

  /**
   * Finaliza pedido
   */
  finishOrder() {
    if (!this.selectedMethod) {
      alert('💳 Por favor, escolha uma forma de pagamento!');
      return;
    }

    // Coletar troco se for dinheiro
    let troco = null;
    if (this.selectedMethod === 'dinheiro') {
      const trocoInput = document.getElementById('troco');
      if (trocoInput && trocoInput.value) {
        troco = parseFloat(trocoInput.value);
        if (isNaN(troco) || troco < 0) {
          alert('❌ Valor do troco inválido!');
          return;
        }
      }
    }

    // Criar objeto Payment
    const payment = new Payment({
      method: this.selectedMethod,
      troco: troco
    });

    // Validar
    const validation = payment.validate();
    if (!validation.valid) {
      alert('❌ Erro no pagamento:\n\n' + validation.errors.join('\n'));
      return;
    }

    // Salvar no store
    this.store.setPayment(payment);

    // Enviar pedido via WhatsApp
    this.sendOrder();
  }

  /**
   * Envia pedido via WhatsApp
   */
  sendOrder() {
    const user = this.store.getUser();
    const payment = this.store.getPayment();
    const cart = this.store.getState().cart;
    const total = this.store.getCartTotal();

    // Montar mensagem
    let message = `🍔 *Pedido Kadu Lanches*\n\n`;
    message += `👤 *Cliente:* ${user.nome}\n`;
    message += `📞 *Telefone:* ${user.getFormattedPhone()}\n\n`;
    
    message += `📝 *Itens:*\n`;
    cart.forEach(item => {
      message += `• ${item.quantity}x ${item.name} - R$ ${item.customizedPrice.toFixed(2).replace('.', ',')}\n`;
      if (item.selectedExtras.length > 0) {
        message += `  + ${item.selectedExtras.length} adicional(is)\n`;
      }
      if (item.observation) {
        message += `  Obs: ${item.observation}\n`;
      }
    });

    message += `\n💰 *Total:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
    message += `💳 *Pagamento:* ${payment.getMethodDescription()}\n`;
    
    if (payment.troco) {
      message += `💵 *Troco para:* ${payment.getFormattedTroco()}\n`;
    }

    message += `\n📍 *Endereço:*\n${user.getFormattedAddress()}`;
    
    if (user.endereco.referencia) {
      message += `\n🔍 *Referência:* ${user.endereco.referencia}`;
    }

    // Detectar plataforma
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Criar URL do WhatsApp
    const whatsappNumber = CONFIG.whatsapp.number;
    const whatsappUrl = isMobile 
      ? `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`
      : `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');

    // Limpar carrinho e dados após delay
    setTimeout(() => {
      this.store.completeOrder();
      alert('✅ Pedido enviado! Aguarde a confirmação no WhatsApp.');
      window.location.href = 'index.html';
    }, 2000);
  }
}
