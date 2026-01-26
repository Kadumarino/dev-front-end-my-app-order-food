// ===============================================
// MODEL: MenuItem
// Representa um item do cardápio
// ===============================================

class MenuItem {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.category = data.category;
    this.image = data.image;
    this.available = data.available !== undefined ? data.available : true;
    this.extras = data.extras || [];
  }

  /**
   * Formata o preço para exibição
   * @returns {string}
   */
  getFormattedPrice() {
    return `R$ ${this.price.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Verifica se o item está disponível
   * @returns {boolean}
   */
  isAvailable() {
    return this.available;
  }

  /**
   * Calcula preço com extras
   * @param {Array} selectedExtras - IDs dos extras selecionados
   * @returns {number}
   */
  calculatePriceWithExtras(selectedExtras = []) {
    let totalPrice = this.price;
    
    selectedExtras.forEach(extraId => {
      const extra = this.extras.find(e => e.id === extraId);
      if (extra) {
        totalPrice += extra.price;
      }
    });
    
    return totalPrice;
  }

  /**
   * Converte para objeto simples
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      image: this.image,
      available: this.available,
      extras: this.extras
    };
  }

  /**
   * Cria instância a partir de objeto
   * @param {Object} data
   * @returns {MenuItem}
   */
  static fromJSON(data) {
    return new MenuItem(data);
  }
}
