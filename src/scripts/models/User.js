// ===============================================
// MODEL: User
// Representa dados do usuário/cliente
// ===============================================

class User {
  constructor(data = {}) {
    this.nome = data.nome || '';
    this.telefone = data.telefone || '';
    this.email = data.email || '';
    this.endereco = data.endereco || {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      cep: '',
      referencia: ''
    };
  }

  /**
   * Valida dados do usuário
   * @returns {{valid: boolean, errors: Array}}
   */
  validate() {
    const errors = [];

    if (!this.nome || this.nome.length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    }

    if (!validatePhone(this.telefone)) {
      errors.push('Telefone inválido');
    }

    if (this.email && !validateEmail(this.email)) {
      errors.push('Email inválido');
    }

    if (!this.endereco.rua) {
      errors.push('Rua é obrigatória');
    }

    if (!this.endereco.numero) {
      errors.push('Número é obrigatório');
    }

    if (!this.endereco.bairro) {
      errors.push('Bairro é obrigatório');
    }

    if (!this.endereco.cidade) {
      errors.push('Cidade é obrigatória');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Formata endereço completo
   * @returns {string}
   */
  getFormattedAddress() {
    const { rua, numero, complemento, bairro, cidade, cep } = this.endereco;
    let address = `${rua}, ${numero}`;
    
    if (complemento) {
      address += ` - ${complemento}`;
    }
    
    address += ` - ${bairro}, ${cidade}`;
    
    if (cep) {
      address += ` - CEP: ${cep}`;
    }
    
    return address;
  }

  /**
   * Formata telefone para exibição
   * @returns {string}
   */
  getFormattedPhone() {
    const cleaned = this.telefone.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    
    return this.telefone;
  }

  /**
   * Converte para objeto simples
   * @returns {Object}
   */
  toJSON() {
    return {
      nome: this.nome,
      telefone: this.telefone,
      email: this.email,
      endereco: this.endereco
    };
  }

  /**
   * Cria instância a partir de objeto
   * @param {Object} data
   * @returns {User}
   */
  static fromJSON(data) {
    return new User(data);
  }
}
