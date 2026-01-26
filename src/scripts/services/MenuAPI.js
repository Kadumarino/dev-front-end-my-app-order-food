// ===============================================
// SERVICE: MenuAPI (Mock)
// Simula chamadas de API para o cardápio
// ===============================================

class MenuAPI {
  constructor() {
    this.menuData = [
      // Lanches
      {
        id: 1,
        name: 'X-Burger',
        description: 'Hambúrguer artesanal, queijo prato',
        price: 18.00,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
        category: 'lanches',
        available: true,
        extras: [
          { id: 'extra-1', name: 'Queijo extra', price: 2.00 },
          { id: 'extra-2', name: 'Bacon', price: 3.00 },
          { id: 'extra-3', name: 'Cebola crispy', price: 2.00 }
        ]
      },
      {
        id: 2,
        name: 'X-Salada',
        description: 'Hambúrguer, queijo, alface, tomate',
        price: 20.00,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        category: 'lanches',
        available: true,
        extras: [
          { id: 'extra-1', name: 'Queijo extra', price: 2.00 },
          { id: 'extra-4', name: 'Molho especial', price: 2.00 },
          { id: 'extra-5', name: 'Picles', price: 2.00 }
        ]
      },
      {
        id: 3,
        name: 'X-Bacon',
        description: 'Bacon crocante e queijo derretido',
        price: 24.00,
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=400&q=80',
        category: 'lanches',
        available: true,
        extras: [
          { id: 'extra-6', name: 'Bacon extra', price: 4.00 },
          { id: 'extra-7', name: 'Cheddar', price: 3.00 },
          { id: 'extra-8', name: 'Cebola caramelizada', price: 3.00 }
        ]
      },
      {
        id: 4,
        name: 'Hot Dog',
        description: 'Dogão com salsicha dupla e molho',
        price: 14.00,
        image: 'https://playswellwithbutter.com/wp-content/uploads/2022/05/Grilled-Hot-Dogs-How-to-Grill-Hot-Dogs-38.jpg',
        category: 'lanches',
        available: true,
        extras: [
          { id: 'extra-9', name: 'Queijo ralado', price: 2.00 },
          { id: 'extra-10', name: 'Batata palha', price: 1.00 }
        ]
      },

      // Porções
      {
        id: 5,
        name: 'Batata Frita',
        description: 'Porção de batata crocante 300g',
        price: 16.00,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80',
        category: 'porcoes',
        available: true,
        extras: [
          { id: 'extra-11', name: 'Cheddar e bacon', price: 5.00 },
          { id: 'extra-12', name: 'Maionese da casa', price: 2.00 }
        ]
      },
      {
        id: 6,
        name: 'Onion Rings',
        description: 'Anéis de cebola empanados',
        price: 18.00,
        image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=400&q=80',
        category: 'porcoes',
        available: true,
        extras: [
          { id: 'extra-13', name: 'Molho barbecue', price: 2.00 }
        ]
      },
      {
        id: 7,
        name: 'Frango Crocante',
        description: 'Tiras de frango empanadas 300g',
        price: 24.00,
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=400&q=80',
        category: 'porcoes',
        available: true,
        extras: [
          { id: 'extra-14', name: 'Molho de alho', price: 2.00 },
          { id: 'extra-13', name: 'Barbecue', price: 2.00 }
        ]
      },

      // Bebidas
      {
        id: 8,
        name: 'Refrigerante Lata',
        description: '350ml gelada',
        price: 7.00,
        image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=400&q=80',
        category: 'bebidas',
        available: true,
        extras: []
      },
      {
        id: 9,
        name: 'Refrigerante 2L',
        description: 'Para compartilhar',
        price: 15.00,
        image: 'https://imgs.extra.com.br/1506170177/1xg.jpg',
        category: 'bebidas',
        available: true,
        extras: []
      },
      {
        id: 10,
        name: 'Água sem gás',
        description: '500ml',
        price: 5.00,
        image: 'https://www.imigrantesbebidas.com.br/img/bebida/images/products/full/2893-agua-mineral-crystal-sem-gas-500ml.jpg',
        category: 'bebidas',
        available: true,
        extras: []
      },
      {
        id: 11,
        name: 'Água com gás',
        description: '500ml',
        price: 6.00,
        image: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/308420-17-02-2023-13-21-42-947.jpg',
        category: 'bebidas',
        available: true,
        extras: []
      },
      {
        id: 12,
        name: 'Cerveja long neck',
        description: '330ml gelada',
        price: 12.00,
        image: 'https://santaluzia.vteximg.com.br/arquivos/ids/963474-1000-1000/1156454.jpg',
        category: 'bebidas',
        available: true,
        extras: []
      },
      {
        id: 13,
        name: 'Cerveja 600ml',
        description: 'Perfeita para dividir',
        price: 18.00,
        image: 'https://www.falkaolanches.com.br/wp-content/uploads/2022/03/25.png',
        category: 'bebidas',
        available: true,
        extras: []
      }
    ];
  }

  /**
   * Simula delay de rede
   * @param {number} ms - Milissegundos
   * @returns {Promise}
   */
  _delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Busca todos os itens do menu
   * @returns {Promise<Array<MenuItem>>}
   */
  async getAllItems() {
    await this._delay();
    return this.menuData.map(item => new MenuItem(item));
  }

  /**
   * Busca itens por categoria
   * @param {string} category
   * @returns {Promise<Array<MenuItem>>}
   */
  async getItemsByCategory(category) {
    await this._delay();
    return this.menuData
      .filter(item => item.category === category)
      .map(item => new MenuItem(item));
  }

  /**
   * Busca item por ID
   * @param {number} id
   * @returns {Promise<MenuItem|null>}
   */
  async getItemById(id) {
    await this._delay();
    const item = this.menuData.find(item => item.id === id);
    return item ? new MenuItem(item) : null;
  }

  /**
   * Busca itens por termo de pesquisa
   * @param {string} query
   * @returns {Promise<Array<MenuItem>>}
   */
  async searchItems(query) {
    await this._delay();
    const lowercaseQuery = query.toLowerCase();
    return this.menuData
      .filter(item => 
        item.name.toLowerCase().includes(lowercaseQuery) ||
        item.description.toLowerCase().includes(lowercaseQuery)
      )
      .map(item => new MenuItem(item));
  }

  /**
   * Retorna todas as categorias disponíveis
   * @returns {Promise<Array<string>>}
   */
  async getCategories() {
    await this._delay(100);
    return [...new Set(this.menuData.map(item => item.category))];
  }
}

// Singleton - Instância única
const menuAPI = new MenuAPI();
