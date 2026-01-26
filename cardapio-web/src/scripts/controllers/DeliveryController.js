// ===============================================
// CONTROLLER: DeliveryController
// Gerencia lógica da página de entrega
// ===============================================

class DeliveryController {
  constructor(store) {
    this.store = store;
  }

  /**
   * Inicializa o controller
   */
  init() {
    this.loadUserData();
    this.setupEventListeners();
  }

  /**
   * Carrega dados do usuário
   */
  loadUserData() {
    const user = this.store.getUser();
    if (!user) return;

    // Preencher formulário com dados existentes
    const fields = {
      'del-nome': user.nome,
      'del-telefone': user.telefone,
      'del-email': user.email,
      'del-rua': user.endereco.rua,
      'del-numero': user.endereco.numero,
      'del-complemento': user.endereco.complemento,
      'del-bairro': user.endereco.bairro,
      'del-cidade': user.endereco.cidade,
      'del-cep': user.endereco.cep,
      'del-referencia': user.endereco.referencia
    };

    Object.entries(fields).forEach(([id, value]) => {
      const field = document.getElementById(id);
      if (field && value) {
        field.value = value;
      }
    });
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    const form = document.getElementById('delivery-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  /**
   * Manipula submit do formulário
   * @param {Event} e
   */
  handleSubmit(e) {
    e.preventDefault();

    // Coletar dados
    const formData = {
      nome: document.getElementById('del-nome').value.trim(),
      telefone: document.getElementById('del-telefone').value.trim(),
      email: document.getElementById('del-email')?.value.trim() || '',
      endereco: {
        rua: document.getElementById('del-rua').value.trim(),
        numero: document.getElementById('del-numero').value.trim(),
        complemento: document.getElementById('del-complemento')?.value.trim() || '',
        bairro: document.getElementById('del-bairro').value.trim(),
        cidade: document.getElementById('del-cidade').value.trim(),
        cep: document.getElementById('del-cep')?.value.trim() || '',
        referencia: document.getElementById('del-referencia')?.value.trim() || ''
      }
    };

    // Sanitizar dados
    const sanitizedData = {
      nome: sanitizeText(formData.nome),
      telefone: sanitizeText(formData.telefone),
      email: sanitizeText(formData.email),
      endereco: {
        rua: sanitizeText(formData.endereco.rua),
        numero: sanitizeText(formData.endereco.numero),
        complemento: sanitizeText(formData.endereco.complemento),
        bairro: sanitizeText(formData.endereco.bairro),
        cidade: sanitizeText(formData.endereco.cidade),
        cep: sanitizeText(formData.endereco.cep),
        referencia: sanitizeText(formData.endereco.referencia)
      }
    };

    // Criar objeto User e validar
    const user = new User(sanitizedData);
    const validation = user.validate();

    if (!validation.valid) {
      alert('❌ Erros no formulário:\n\n' + validation.errors.join('\n'));
      return;
    }

    // Salvar no store
    this.store.setUser(user);

    // Redirecionar para pagamento
    window.location.href = 'pagamento.html';
  }
}
