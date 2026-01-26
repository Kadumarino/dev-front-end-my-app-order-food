// ===============================================
// UTILITY: Notification System
// Sistema de notificações toast para substituir alerts
// ===============================================

class NotificationSystem {
  constructor() {
    this.container = null;
    this.init();
  }

  /**
   * Inicializa o container de notificações
   */
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.className = 'notification-container';
      document.body.appendChild(this.container);
    }
  }

  /**
   * Mostra uma notificação
   * @param {string} message - Mensagem a ser exibida
   * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duração em ms (0 = não fecha automaticamente)
   */
  show(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = this.getIcon(type);
    notification.innerHTML = `
      <span class="notification-icon">${icon}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Fechar notificação">×</button>
    `;

    // Adicionar ao container
    this.container.appendChild(notification);

    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 10);

    // Botão de fechar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => this.hide(notification));

    // Auto-fechar
    if (duration > 0) {
      setTimeout(() => this.hide(notification), duration);
    }

    return notification;
  }

  /**
   * Esconde uma notificação
   * @param {HTMLElement} notification
   */
  hide(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  /**
   * Retorna ícone baseado no tipo
   * @param {string} type
   * @returns {string}
   */
  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }

  /**
   * Atalhos para tipos específicos
   */
  success(message, duration = 4000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 4500) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 4000) {
    return this.show(message, 'info', duration);
  }

  /**
   * Remove todas as notificações
   */
  clearAll() {
    const notifications = this.container.querySelectorAll('.notification');
    notifications.forEach(n => this.hide(n));
  }
}

// Instância global
const notify = new NotificationSystem();
