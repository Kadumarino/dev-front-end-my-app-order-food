// Funções compartilhadas entre todas as páginas

// Verificar horário de atendimento
function checkBusinessHours() {
  const now = new Date();
  const day = now.getDay(); // 0=Domingo, 5=Sexta, 6=Sábado
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes; // Tempo em minutos

  let isOpen = false;

  if (day === 5) {
    // Sexta: 18:00 às 00:00
    isOpen = currentTime >= 18 * 60; // A partir das 18:00
  } else if (day === 6) {
    // Sábado: 15:00 às 00:00
    isOpen = currentTime >= 15 * 60; // A partir das 15:00
  } else if (day === 0) {
    // Domingo: 15:00 às 00:00
    isOpen = currentTime >= 15 * 60; // A partir das 15:00
  }

  return isOpen;
}

// Dark mode toggle
function initDarkMode() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggle.textContent = '☀️';
  }

  // Toggle handler
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    toggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// Validação de formulário
function validateForm(fields) {
  for (const [name, value] of Object.entries(fields)) {
    if (!value || !value.trim()) {
      alert(`Preencha o campo ${name}.`);
      return false;
    }
  }
  return true;
}

// Formatar endereço
function formatEndereco(endereco) {
  return `${endereco.rua}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}${endereco.referencia ? ' - Ref: ' + endereco.referencia : ''}`;
}

// Formatar preço
function formatPrice(value) {
  return value.toFixed(2).replace('.', ',');
}

// Enviar para WhatsApp
function sendWhatsApp(user, payment, cart, total) {
  const itemsList = cart.map(i => {
    const price = i.customizedPrice || i.price;
    const extras = i.adicionais && i.adicionais.length ? ` (${i.adicionais.join(', ')})` : '';
    const obs = i.observacao ? `\n  Obs: ${i.observacao}` : '';
    return `• ${i.name} - R$${formatPrice(price)}${extras}${obs}`;
  }).join('\n');

  const enderecoFormatado = formatEndereco(user.endereco);

  let paymentLine = 'Pagamento: não informado';
  let trocoTexto = '';
  if (payment.method === 'credito') {
    paymentLine = 'Pagamento: Cartão de Crédito na entrega';
  } else if (payment.method === 'debito') {
    paymentLine = 'Pagamento: Cartão de Débito na entrega';
  } else if (payment.method === 'dinheiro') {
    paymentLine = 'Pagamento: Dinheiro na entrega';
    trocoTexto = payment.troco ? `\nTroco para: R$ ${formatPrice(parseFloat(payment.troco))}` : '';
  }

  // Sanitizar dados do usuário
  const sanitizedUser = {
    nome: sanitizeText(user.nome),
    telefone: sanitizeText(user.telefone || 'Não informado')
  };

  // Verificar se é pedido agendado
  const scheduledOrder = JSON.parse(localStorage.getItem('scheduledOrder') || '{}');
  let scheduleText = '';
  if (scheduledOrder.scheduled) {
    scheduleText = `\n\n⏰ *PEDIDO AGENDADO PARA ${scheduledOrder.deliveryTime.toUpperCase()}*`;
  }

  const message = `🍔 *Pedido Kadu Lanches*${scheduleText}\n\n👤 Cliente: ${sanitizedUser.nome}\n📞 Telefone: ${sanitizedUser.telefone}\n\n📝 *Itens:*\n${itemsList}\n\n💰 *Total: R$${formatPrice(total)}*\n💳 ${paymentLine}${trocoTexto}\n\n📍 Endereço: ${enderecoFormatado}`;

  // Limpar informação de agendamento após criar mensagem
  localStorage.removeItem('scheduledOrder');

  // Usar configuração centralizada
  const whatsappNumber = CONFIG.whatsapp.number;
  
  // Detectar plataforma
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Criar URL do WhatsApp
  const whatsappUrl = isMobile 
    ? `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`
    : `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
  
  // Abrir WhatsApp
  window.open(whatsappUrl, '_blank');
  
  // Limpar dados e voltar para a home após 2 segundos
  setTimeout(() => {
    localStorage.removeItem('cart');
    localStorage.removeItem('payment');
    window.location.href = 'index.html';
  }, 2000);
}

// Inicializar ao carregar página
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  
  // Exibir aviso de horário apenas como informação (não bloqueia)
  showBusinessHoursInfo();
});

// Exibe informação sobre horário de funcionamento
function showBusinessHoursInfo() {
  if (!checkBusinessHours()) {
    // Criar banner informativo no topo da página
    const banner = document.createElement('div');
    banner.id = 'hours-info-banner';
    banner.style.cssText = `
      background: linear-gradient(135deg, #ff9800, #f57c00);
      color: white;
      padding: 12px 20px;
      text-align: center;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      position: sticky;
      top: 0;
      z-index: 999;
    `;
    banner.innerHTML = `
      🕒 Estamos fora do horário de atendimento. Pedidos serão entregues a partir das 18h (sexta) ou 15h (sábado/domingo).
    `;
    document.body.insertBefore(banner, document.body.firstChild);
  }
}
