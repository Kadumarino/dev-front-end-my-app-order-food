const menuItems = [
  // Lanches
  { name: 'X-Burger', description: 'Hambúrguer artesanal, queijo prato', price: 18, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80', category: 'lanches', adicionais: ['Queijo extra (+R$2)', 'Bacon (+R$3)', 'Cebola crispy (+R$2)'] },
  { name: 'X-Salada', description: 'Hambúrguer, queijo, alface, tomate', price: 20, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80', category: 'lanches', adicionais: ['Queijo extra (+R$2)', 'Molho especial (+R$2)', 'Picles (+R$2)'] },
  { name: 'X-Bacon', description: 'Bacon crocante e queijo derretido', price: 24, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=400&q=80', category: 'lanches', adicionais: ['Bacon extra (+R$4)', 'Cheddar (+R$3)', 'Cebola caramelizada (+R$3)'] },
  { name: 'Hot Dog', description: 'Dogão com salsicha dupla e molho', price: 14, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80', category: 'lanches', adicionais: ['Queijo ralado (+R$2)', 'Batata palha (+R$1)'] },

  // Porções
  { name: 'Batata Frita', description: 'Porção de batata crocante 300g', price: 16, image: 'https://images.unsplash.com/photo-1585238341986-08d1a863ba8c?auto=format&fit=crop&w=400&q=80', category: 'porcoes', adicionais: ['Cheddar e bacon (+R$5)', 'Maionese da casa (+R$2)'] },
  { name: 'Onion Rings', description: 'Anéis de cebola empanados', price: 18, image: 'https://images.unsplash.com/photo-1604908177390-1c9ad3ab8cf5?auto=format&fit=crop&w=400&q=80', category: 'porcoes', adicionais: ['Molho barbecue (+R$2)'] },
  { name: 'Frango Crocante', description: 'Tiras de frango empanadas 300g', price: 24, image: 'https://images.unsplash.com/photo-1604908177520-4025b469c698?auto=format&fit=crop&w=400&q=80', category: 'porcoes', adicionais: ['Molho de alho (+R$2)', 'Barbecue (+R$2)'] },

  // Bebidas
  { name: 'Refrigerante Lata', description: '350ml gelada', price: 7, image: 'https://images.unsplash.com/photo-1544126592-807ade215aa8?auto=format&fit=crop&w=400&q=80', category: 'bebidas', adicionais: [] },
  { name: 'Refrigerante 2L', description: 'Para compartilhar', price: 15, image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80', category: 'bebidas', adicionais: [] },
  { name: 'Água sem gás', description: '500ml', price: 5, image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80', category: 'bebidas', adicionais: [] },
  { name: 'Água com gás', description: '500ml', price: 6, image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80', category: 'bebidas', adicionais: [] },
  { name: 'Cerveja long neck', description: '330ml gelada', price: 12, image: 'https://images.unsplash.com/photo-1514361892635-6e122620e4d1?auto=format&fit=crop&w=400&q=80', category: 'bebidas', adicionais: [] },
  { name: 'Cerveja 600ml', description: 'Perfeita para dividir', price: 18, image: 'https://images.unsplash.com/photo-1514361892635-6e122620e4d1?auto=format&fit=crop&w=400&q=80', category: 'bebidas', adicionais: [] },
];

const menu = document.getElementById('menu');
const cartItems = document.getElementById('cart-items');
const totalElement = document.getElementById('total');
const tabBtns = document.querySelectorAll('.tab-btn');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = cart.reduce((sum, item) => sum + (item.customizedPrice || item.price), 0);
let currentItem = null;
let currentCategory = 'lanches';

// Atualizar exibição do carrinho
function updateCartDisplay() {
  cartItems.innerHTML = '';
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<li class="empty-cart">Carrinho vazio</li>';
    totalElement.textContent = 'Total: R$ 0,00';
    return;
  }
  
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    const price = (item.customizedPrice || item.price).toFixed(2).replace('.', ',');
    li.textContent = `${item.name} - R$ ${price}`;
    
    // Adicionar adicionais sem valores
    if (item.adicionais && item.adicionais.length > 0) {
      const adicionaisText = item.adicionais.map(a => a.replace(/\s*\(\+R\$\d+\)/, '')).join(', ');
      const adicionaisSpan = document.createElement('div');
      adicionaisSpan.className = 'cart-extras';
      adicionaisSpan.textContent = adicionaisText;
      li.appendChild(adicionaisSpan);
    }
    
    // Adicionar observação se houver
    if (item.observacao) {
      const obsSpan = document.createElement('div');
      obsSpan.className = 'cart-obs';
      obsSpan.textContent = `Obs: ${item.observacao}`;
      li.appendChild(obsSpan);
    }
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Excluir';
    removeBtn.className = 'remove-btn';
    removeBtn.title = 'Remover item';
    removeBtn.onclick = () => {
      cart.splice(index, 1);
      saveCart();
    };
    li.appendChild(removeBtn);
    cartItems.appendChild(li);
  });
  
  totalElement.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Salvar carrinho
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  total = cart.reduce((sum, item) => sum + (item.customizedPrice || item.price), 0);
  updateCartDisplay();
}

// Renderizar menu por categoria
function renderMenu() {
  menu.innerHTML = '';
  const group = document.createElement('div');
  group.className = 'menu-group';
  
  menuItems.filter(i => i.category === currentCategory).forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <div class="item-content">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
          <h3>${item.name}</h3>
          <p class="item-description">${item.description}</p>
        </div>
      </div>
      <div class="item-footer">
        <span class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
      </div>
    `;
    
    const button = document.createElement('button');
    button.textContent = 'Adicionar';
    button.addEventListener('click', () => {
      if (item.adicionais && item.adicionais.length > 0) {
        showCustomizeView(item);
      } else {
        const customizedItem = { ...item, adicionais: [], customizedPrice: item.price };
        cart.push(customizedItem);
        saveCart();
      }
    });
    
    div.querySelector('.item-footer').appendChild(button);
    group.appendChild(div);
  });

  menu.appendChild(group);
}

// Mostrar view de personalização
function showCustomizeView(item) {
  currentItem = item;
  document.getElementById('customize-title').textContent = `🍔 Personalizar ${item.name}`;
  const adicionaisDiv = document.getElementById('customize-adicionais');
  adicionaisDiv.innerHTML = '';
  
  if (item.adicionais && item.adicionais.length > 0) {
    const title = document.createElement('h3');
    title.textContent = 'Adicionais:';
    title.className = 'adicionais-title';
    adicionaisDiv.appendChild(title);
    
    item.adicionais.forEach(adic => {
      const label = document.createElement('label');
      label.className = 'checkbox-label';
      label.innerHTML = `<input type="checkbox" value="${adic}"> <span>${adic}</span>`;
      adicionaisDiv.appendChild(label);
    });
    
    const checkboxes = adicionaisDiv.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', updateCustomizePrice);
    });
  }
  
  updateCustomizePrice();
  showSection('customize-view');
}

// Atualizar preço de personalização
function updateCustomizePrice() {
  if (!currentItem) return;
  
  const selectedAdicionais = Array.from(document.querySelectorAll('#customize-adicionais input:checked'));
  const additionalPrice = selectedAdicionais.reduce((sum, cb) => {
    const match = cb.value.match(/\+R\$(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);
  
  const totalPrice = currentItem.price + additionalPrice;
  document.getElementById('customize-price').textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
}

// Aplicar personalização
document.getElementById('apply-customize').addEventListener('click', () => {
  const selectedAdicionais = Array.from(document.querySelectorAll('#customize-adicionais input:checked')).map(cb => cb.value);
  const observacao = document.getElementById('observacao').value.trim();
  const customizedItem = { 
    ...currentItem, 
    adicionais: selectedAdicionais,
    observacao: observacao,
    customizedPrice: currentItem.price + selectedAdicionais.reduce((sum, adic) => {
      const match = adic.match(/\+R\$(\d+)/);
      return sum + (match ? parseInt(match[1]) : 0);
    }, 0)
  };
  cart.push(customizedItem);
  saveCart();
  document.getElementById('observacao').value = '';
  hideSection('customize-view');
});

// Mostrar/esconder seções
function showSection(id) {
  document.getElementById(id).style.display = 'block';
  document.body.classList.add('flow-open');
}

function hideSection(id) {
  document.getElementById(id).style.display = 'none';
  if (![...document.querySelectorAll('.flow-section')].some(s => s.style.display === 'block')) {
    document.body.classList.remove('flow-open');
  }
}

// Fechar customize view
document.querySelector('.close-flow[data-target="customize-view"]')?.addEventListener('click', () => {
  hideSection('customize-view');
});

// Ver pedido - redireciona para entrega.html
document.getElementById('view-order').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('🛒 Adicione itens ao carrinho primeiro!');
    return;
  }
  window.location.href = 'entrega.html';
});

// Listeners para abas de categorias
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const clickedCategory = btn.dataset.category;
    
    if (currentCategory === clickedCategory && menu.style.display !== 'none') {
      menu.style.display = 'none';
    } else {
      currentCategory = clickedCategory;
      menu.style.display = 'block';
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMenu();
    }
  });
});

// Atualizar contadores nas abas
function updateTabCounters() {
  tabBtns.forEach(btn => {
    const cat = btn.dataset.category;
    const count = menuItems.filter(i => i.category === cat).length;
    const label = btn.textContent.split(' (')[0];
    btn.textContent = `${label} (${count})`;
  });
}

// Swipe para mudar categoria
let touchStartX = 0;
let touchEndX = 0;
menu.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

menu.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, false);

function handleSwipe() {
  const diff = touchStartX - touchEndX;
  const categories = ['lanches', 'porcoes', 'bebidas'];
  const idx = categories.indexOf(currentCategory);
  
  if (diff > 50 && idx < categories.length - 1) {
    currentCategory = categories[idx + 1];
  } else if (diff < -50 && idx > 0) {
    currentCategory = categories[idx - 1];
  } else {
    return;
  }

  tabBtns.forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-category="${currentCategory}"]`).classList.add('active');
  renderMenu();
  document.querySelector('.category-tabs').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Pull-to-refresh
let touchStartY = 0;
let pullTriggered = false;
window.addEventListener('touchstart', (e) => {
  if (window.scrollY === 0) {
    touchStartY = e.touches[0].clientY;
    pullTriggered = false;
  }
});

window.addEventListener('touchmove', (e) => {
  if (window.scrollY === 0 && !pullTriggered) {
    const delta = e.touches[0].clientY - touchStartY;
    if (delta > 70) {
      pullTriggered = true;
      location.reload();
    }
  }
});

// Inicialização
updateCartDisplay();
renderMenu();
updateTabCounters();

// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('SW registered'))
    .catch(error => console.log('SW registration failed', error));
}
