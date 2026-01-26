// ===============================================
// MODEL: Payment
// Representa forma de pagamento
// ===============================================

class Payment {
  constructor(data = {}) {
    this.method = data.method || ''; // 'dinheiro', 'credito', 'debito', 'pix'
    this.troco = data.troco || null;
  }

  /**
   * Valida dados de pagamento
   * @returns {{valid: boolean, errors: Array}}
   */
  validate() {
    const errors = [];

    if (!this.method) {
      errors.push('Selecione uma forma de pagamento');
    }

    const validMethods = ['dinheiro', 'credito', 'debito', 'pix'];
    if (!validMethods.includes(this.method)) {
      errors.push('Forma de pagamento inválida');
    }

    if (this.method === 'dinheiro' && this.troco) {
      const trocoValue = parseFloat(this.troco);
      if (isNaN(trocoValue) || trocoValue < 0) {
        errors.push('Valor do troco inválido');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Retorna descrição legível do método
   * @returns {string}
   */
  getMethodDescription() {
    const descriptions = {
      'dinheiro': '💵 Dinheiro',
      'credito': '💳 Cartão de Crédito',
      'debito': '💳 Cartão de Débito',
      'pix': '📱 PIX'
    };

    return descriptions[this.method] || 'Não definido';
  }

  /**
   * Formata troco para exibição
   * @returns {string|null}
   */
  getFormattedTroco() {
    if (!this.troco) return null;
    return `R$ ${parseFloat(this.troco).toFixed(2).replace('.', ',')}`;
  }

  /**
   * Converte para objeto simples
   * @returns {Object}
   */
  toJSON() {
    return {
      method: this.method,
      troco: this.troco
    };
  }

  /**
   * Cria instância a partir de objeto
   * @param {Object} data
   * @returns {Payment}
   */
  static fromJSON(data) {
    return new Payment(data);
  }
}
