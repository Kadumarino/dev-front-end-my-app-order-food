// ===============================================
// APP: Inicialização da Aplicação
// Ponto de entrada principal
// ===============================================

// Instâncias globais
let menuController;
let cartController;

/**
 * Inicializa a aplicação na página index
 */
function initIndexPage() {
  // Inicializar controllers
  menuController = new MenuController(menuAPI, store);
  cartController = new CartController(store);

  // Inicializar
  menuController.init();
  cartController.init();

  // Tema
  initTheme();

  // Exibir modal informativa de horário (apenas 1 vez por sessão)
  showBusinessHoursInfoModal();
}

/**
 * Inicializa a aplicação na página de entrega
 */
function initDeliveryPage() {
  const deliveryController = new DeliveryController(store);
  deliveryController.init();
  initTheme();
}

/**
 * Inicializa a aplicação na página de pagamento
 */
function initPaymentPage() {
  const paymentController = new PaymentController(store);
  paymentController.init();
  initTheme();
}

/**
 * Inicializa tema
 */
function initTheme() {
  const theme = store.getTheme();
  document.body.classList.toggle('dark-mode', theme === 'dark');

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => {
      store.toggleTheme();
      themeToggle.textContent = store.getTheme() === 'dark' ? '☀️' : '🌙';
    });
  }
}

/**
 * Verifica horário de funcionamento
 */
function checkBusinessHours() {
  // Verificar se modal já foi exibido nesta sessão
  if (sessionStorage.getItem('closedModalShown')) {
    return;
  }

  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour + currentMinute / 60;

  // Verificar se está em dia de funcionamento
  if (!CONFIG.businessHours.days.includes(currentDay)) {
    showClosedModal('Hoje estamos fechados! 😴');
    return;
  }

  // Extrair horas de abertura e fechamento
  const [openHour, openMinute] = CONFIG.businessHours.open.split(':').map(Number);
  const [closeHour, closeMinute] = CONFIG.businessHours.close.split(':').map(Number);
  const openTime = openHour + openMinute / 60;
  const closeTime = closeHour + closeMinute / 60;

  // Verificar se está fora do horário
  if (currentTime < openTime || currentTime >= closeTime) {
    showClosedModal(`Estamos fechados! 🕒\n\nHorário: ${CONFIG.businessHours.open} às ${CONFIG.businessHours.close}`);
  }
}

/**
 * Exibe modal de fechado
 * @param {string} message
 */
function showClosedModal(message) {
  // Marcar como exibido nesta sessão
  sessionStorage.setItem('closedModalShown', 'true');

  const modal = document.createElement('div');
  modal.className = 'modal business-closed-modal';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>⏰ Fora do Horário</h2>
      </div>
      <div class="modal-body">
        <p style="white-space: pre-line;">${message}</p>
        <p>Você ainda pode montar seu pedido, mas não conseguirá finalizá-lo agora.</p>
      </div>
      <div class="modal-footer">
        <button class="btn-primary" onclick="this.closest('.modal').remove()">Entendi</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Desabilitar botão de checkout
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = true;
    checkoutBtn.title = 'Fora do horário de funcionamento';
  }

  // Desabilitar botões de adicionar
  if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    setTimeout(() => {
      document.querySelectorAll('.item button').forEach(btn => {
        btn.disabled = true;
        btn.textContent = '⏰ Fora do horário';
      });
    }, 1000);
  }
}

/**
 * Detecta qual página está carregando e inicializa apropriadamente
 */
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('entrega.html')) {
    initDeliveryPage();
  } else if (path.includes('pagamento.html') || path.includes('payment.html')) {
    initPaymentPage();
  } else {
    // index.html ou raiz
    initIndexPage();
  }

  // Registrar service worker com auto-atualização
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registrado com sucesso');
        
        // Verificar atualizações a cada 60 segundos
        setInterval(() => {
          registration.update();
        }, 60000);

        // Detectar quando novo service worker está aguardando
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Novo service worker disponível - recarregar página automaticamente
              console.log('Nova versão disponível - atualizando...');
              window.location.reload();
            }
          });
        });
      })
      .catch(error => {
        console.error('Erro ao registrar Service Worker:', error);
      });

    // Recarregar quando o service worker tomar controle
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
});
