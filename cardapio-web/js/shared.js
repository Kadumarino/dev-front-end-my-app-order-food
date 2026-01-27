// Funções compartilhadas entre todas as páginas

// Verificar horário de atendimento
function checkBusinessHours() {
  // Obter horário de Brasília (UTC-3)
  const now = new Date();
  const brasiliaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  
  const day = brasiliaTime.getDay(); // 0=Domingo, 5=Sexta, 6=Sábado
  const hours = brasiliaTime.getHours();
  const minutes = brasiliaTime.getMinutes();
  const currentTime = hours * 60 + minutes; // Tempo em minutos

  // Debug: descomentar para testar
  // console.log('Debug horário Brasília:', { day, hours, minutes, currentTime, date: brasiliaTime.toString() });

  let isOpen = false;

  if (day === 5) {
    // Sexta: 18:00 às 00:00
    isOpen = currentTime >= (18 * 60); // A partir das 18:00 (1080 minutos)
  } else if (day === 6) {
    // Sábado: 15:00 às 00:00
    isOpen = currentTime >= (15 * 60); // A partir das 15:00 (900 minutos)
  } else if (day === 0) {
    // Domingo: 15:00 às 00:00
    isOpen = currentTime >= (15 * 60); // A partir das 15:00 (900 minutos)
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
    
    // Definir quem pediu (nome da pessoa ou "Sem Nome")
    const personName = i.personName || 'Sem Nome';
    
    // Montar lista de adicionais apenas com nomes (sem valores)
    let extras = '';
    if (i.selectedExtras && i.selectedExtras.length > 0) {
      // Buscar nomes dos extras do menu original
      const menuData = JSON.parse(sessionStorage.getItem('menuData') || '[]');
      const menuItem = menuData.find(item => item.id === i.menuItemId);
      
      if (menuItem && menuItem.extras) {
        const extrasNames = i.selectedExtras
          .map(extraId => {
            const extra = menuItem.extras.find(e => e.id === extraId);
            return extra ? extra.name : null;
          })
          .filter(name => name);
        
        if (extrasNames.length > 0) {
          extras = ` (${extrasNames.join(', ')})`;
        }
      }
    }
    
    const obs = i.observation ? `\n  Obs: ${i.observation}` : '';
    return `• ${personName} - ${i.name}${extras} - R$${formatPrice(price)}${obs}`;
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

  // Verificar se estabelecimento está aberto e criar seção de agendamento
  const now = new Date();
  const brasiliaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const day = brasiliaTime.getDay();
  const hours = brasiliaTime.getHours();
  const minutes = brasiliaTime.getMinutes();
  const currentTime = hours * 60 + minutes;
  
  let isOpen = false;
  if (day === 5) { // Sexta
    isOpen = currentTime >= (18 * 60);
  } else if (day === 6 || day === 0) { // Sábado ou Domingo
    isOpen = currentTime >= (15 * 60);
  }
  
  console.log('🕒 Status do estabelecimento:', { day, hours, minutes, isOpen, currentTime });
  
  let scheduleSection = '';
  const scheduledOrder = JSON.parse(localStorage.getItem('scheduledOrder') || '{}');
  const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  let diaPedido = '';
  let horario = '';
  
  // Determinar próximo dia de funcionamento quando fechado
  if (!isOpen || scheduledOrder.scheduled) {
    if (day === 5 && hours < 18) {
      diaPedido = 'Sexta-feira';
      horario = '18h';
    } else if (day === 6 && hours < 15) {
      diaPedido = 'Sábado';
      horario = '15h';
    } else if (day === 0 && hours < 15) {
      diaPedido = 'Domingo';
      horario = '15h';
    } else if (day === 5 && hours >= 18) {
      diaPedido = 'Sábado';
      horario = '15h';
    } else if (day === 6 && hours >= 15) {
      diaPedido = 'Domingo';
      horario = '15h';
    } else if (day === 0 && hours >= 15) {
      diaPedido = 'próxima Sexta-feira';
      horario = '18h';
    } else {
      // Segunda a quinta: próxima sexta
      diaPedido = 'Sexta-feira';
      horario = '18h';
    }
    
    if (!isOpen) {
      scheduleSection = `

⏰ *ESTABELECIMENTO FECHADO*
📅 Pedido será realizado em *${diaPedido}* após as ${horario}
📞 _O estabelecimento entrará em contato para confirmar o pedido_`;
      console.log('📝 Mensagem criada (FECHADO):', scheduleSection);
      console.log('📝 Variáveis:', { diaPedido, horario, isOpen });
    } else if (scheduledOrder.scheduled) {
      scheduleSection = `

🕒 *ENTREGA AGENDADA*
📅 Entrega agendada para *${diasSemana[day]}* após as 18h
📞 _O estabelecimento entrará em contato_`;
      console.log('📝 Mensagem criada (AGENDADO):', scheduleSection);
    }
  }
  
  // Determinar saudação baseada no horário
  let saudacao = '';
  let periodo = '';
  if (hours >= 0 && hours < 12) {
    saudacao = 'Bom dia';
    periodo = 'dia';
  } else if (hours >= 12 && hours < 18) {
    saudacao = 'Boa tarde';
    periodo = 'tarde';
  } else {
    saudacao = 'Boa noite';
    periodo = 'noite';
  }
  
  console.log('📝 scheduleSection ANTES de criar message:', scheduleSection);

  const message = `${saudacao}! 👋
_Que bom que nos escolheu para memorar o seu ${periodo}_

🍔 *Pedido Kadu Lanches*

👤 *Cliente:* ${sanitizedUser.nome}
📞 *Telefone:* ${sanitizedUser.telefone}

📝 *Itens:*
${itemsList}

💰 *Total: R$${formatPrice(total)}*
💳 ${paymentLine}${trocoTexto}

📍 *Endereço:* ${enderecoFormatado}${scheduleSection}`;

  console.log('📱 Mensagem completa WhatsApp:');
  console.log(message);
  console.log('📱 Tamanho da mensagem:', message.length);
  console.log('📱 URL encoded:', encodeURIComponent(message).substring(0, 200) + '...');

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
