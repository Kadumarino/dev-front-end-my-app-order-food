import pool from './database.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Limpar tabelas (cuidado em produção!)
    if (process.env.NODE_ENV === 'development') {
      await client.query('TRUNCATE TABLE order_items, orders, addresses, customers, product_extras, products, extras, categories, users RESTART IDENTITY CASCADE');
      console.log('🗑️  Tabelas limpas');
    }

    // 1. Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
      ['Administrador', 'admin@kadulanches.com', hashedPassword, 'admin']
    );
    console.log('✅ Usuário admin criado');

    // 2. Criar categorias
    const categories = [
      ['Lanches', 'lanches', '🍔', 1],
      ['Porções', 'porcoes', '🍟', 2],
      ['Bebidas', 'bebidas', '🥤', 3]
    ];

    for (const cat of categories) {
      await client.query(
        'INSERT INTO categories (name, slug, icon, display_order) VALUES ($1, $2, $3, $4)',
        cat
      );
    }
    console.log('✅ Categorias criadas');

    // 3. Criar extras
    const extras = [
      ['Queijo', 2.50, 'adicional'],
      ['Bacon', 3.00, 'adicional'],
      ['Ovo', 2.00, 'adicional'],
      ['Catupiry', 3.50, 'adicional'],
      ['Cheddar', 3.00, 'adicional'],
      ['Salada', 1.50, 'adicional'],
      ['Milho', 1.50, 'adicional'],
      ['Ervilha', 1.50, 'adicional']
    ];

    const extraIds = [];
    for (const extra of extras) {
      const result = await client.query(
        'INSERT INTO extras (name, price, category) VALUES ($1, $2, $3) RETURNING id',
        extra
      );
      extraIds.push(result.rows[0].id);
    }
    console.log('✅ Extras criados');

    // 4. Criar produtos
    const products = [
      // Lanches
      {
        name: 'X-Burger',
        description: 'Hambúrguer, queijo, alface, tomate e maionese',
        price: 15.00,
        category: 1,
        extras: [0, 1, 2, 3, 4, 5]
      },
      {
        name: 'X-Bacon',
        description: 'Hambúrguer, bacon, queijo, alface, tomate e maionese',
        price: 18.00,
        category: 1,
        extras: [0, 1, 2, 3, 4, 5]
      },
      {
        name: 'X-Egg',
        description: 'Hambúrguer, ovo, queijo, alface, tomate e maionese',
        price: 16.50,
        category: 1,
        extras: [0, 1, 2, 3, 4, 5]
      },
      {
        name: 'X-Tudo',
        description: 'Hambúrguer, bacon, ovo, queijo, presunto, alface, tomate e maionese',
        price: 22.00,
        category: 1,
        extras: [0, 1, 2, 3, 4, 5]
      },
      // Porções
      {
        name: 'Batata Frita',
        description: 'Porção de batata frita crocante (500g)',
        price: 18.00,
        category: 2,
        extras: [4, 3]
      },
      {
        name: 'Onion Rings',
        description: 'Anéis de cebola empanados (400g)',
        price: 20.00,
        category: 2,
        extras: [4, 3]
      },
      {
        name: 'Nuggets',
        description: '12 unidades de nuggets de frango',
        price: 22.00,
        category: 2,
        extras: [4, 3]
      },
      // Bebidas
      {
        name: 'Coca-Cola Lata',
        description: 'Refrigerante Coca-Cola 350ml',
        price: 5.00,
        category: 3,
        extras: []
      },
      {
        name: 'Guaraná Lata',
        description: 'Refrigerante Guaraná 350ml',
        price: 5.00,
        category: 3,
        extras: []
      },
      {
        name: 'Suco Natural',
        description: 'Suco natural de frutas 500ml',
        price: 8.00,
        category: 3,
        extras: []
      },
      {
        name: 'Água Mineral',
        description: 'Água mineral 500ml',
        price: 3.00,
        category: 3,
        extras: []
      }
    ];

    for (const product of products) {
      const result = await client.query(
        'INSERT INTO products (name, description, price, category_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [product.name, product.description, product.price, product.category]
      );
      
      const productId = result.rows[0].id;
      
      // Associar extras ao produto
      for (const extraIndex of product.extras) {
        await client.query(
          'INSERT INTO product_extras (product_id, extra_id) VALUES ($1, $2)',
          [productId, extraIds[extraIndex]]
        );
      }
    }
    console.log('✅ Produtos criados com extras associados');

    console.log('✅ Seed completo!');
    console.log('\n📋 Credenciais de acesso:');
    console.log('Email: admin@kadulanches.com');
    console.log('Senha: admin123');
    
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Executar seed se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seed();
}

export default seed;
