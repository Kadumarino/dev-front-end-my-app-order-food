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
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.textContent = '☀️';
    }
  }
}

/**
 * Exibe modal informativa sobre horários (1 vez por sessão)
 */
function showBusinessHoursInfoModal() {
  // Verificar se já foi exibido nesta sessão
  if (sessionStorage.getItem('hoursInfoShown')) {
    return;
  }

  // Verificar se está fora do horário usando a mesma lógica do shared.js
  if (!checkBusinessHours()) {
    // Marcar como exibido nesta sessão
    sessionStorage.setItem('hoursInfoShown', 'true');

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content business-hours-info-modal">
        <div class="schedule-modal-header">
          <div class="schedule-modal-icon">🕒</div>
          <h2 class="schedule-modal-title">Horário de Atendimento</h2>
        </div>
        
        <div class="schedule-info-box">
          <p class="schedule-info-title">📅 Funcionamos:</p>
          <ul class="schedule-hours-list">
            <li><strong>Sexta-feira:</strong> 18h às 00h</li>
            <li><strong>Sábado:</strong> 15h às 00h</li>
            <li><strong>Domingo:</strong> 15h às 00h</li>
          </ul>
        </div>

        <div class="schedule-alert-box">
          <p class="schedule-alert-text">
            ⚠️ <strong>Pedidos fora do horário serão agendados</strong><br>
            Você pode montar seu pedido agora e ele será entregue no próximo horário de atendimento.
          </p>
        </div>

        <button class="btn-primary business-hours-ok-btn" id="close-hours-modal">
          OK, entendi
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // Mostrar modal
    setTimeout(() => {
      modal.style.display = 'flex';
    }, 10);

    // Event listener para fechar
    document.getElementById('close-hours-modal').addEventListener('click', () => {
      modal.remove();
    });

    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
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

  // Registrar service worker com auto-atualização (apenas em HTTP/HTTPS)
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
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
