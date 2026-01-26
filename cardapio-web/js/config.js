// ===============================================
// CONFIGURAÇÕES DA APLICAÇÃO
// ===============================================
// Este arquivo centraliza as configurações.
// Em produção, essas variáveis virão do backend/API

const CONFIG = {
  // WhatsApp
  whatsapp: {
    number: '5519986021602', // TODO: Mover para backend/.env
    greeting: 'Olá! Gostaria de fazer um pedido:'
  },

  // Horário de Funcionamento
  businessHours: {
    open: '18:00',
    close: '23:00',
    days: [0, 2, 3, 4, 5, 6] // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab
  },

  // Dados do Estabelecimento
  business: {
    name: 'Kadu Lanches',
    address: '',
    phone: '(19) 98602-1602'
  },

  // Configurações de Entrega
  delivery: {
    timeMin: 30,
    timeMax: 50,
    fee: 5.00,
    minimumOrder: 15.00
  },

  // Cache e PWA
  cache: {
    name: 'kadu-lanches-v1',
    version: '1.0.0'
  },

  // Segurança
  security: {
    sessionTimeout: 60, // minutos
    maxCartItems: 20,
    maxItemQuantity: 10
  }
};

// Proteção contra modificação
Object.freeze(CONFIG);
Object.freeze(CONFIG.whatsapp);
Object.freeze(CONFIG.businessHours);
Object.freeze(CONFIG.business);
Object.freeze(CONFIG.delivery);
Object.freeze(CONFIG.cache);
Object.freeze(CONFIG.security);
