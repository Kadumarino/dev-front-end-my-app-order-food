// ===============================================
// SCRIPT DO FORMULÁRIO DE ENTREGA
// ===============================================

// Limpar telefones do localStorage no início de nova sessão
// (mantém nome e endereço, mas remove telefones)
if (!sessionStorage.getItem('sessionActive')) {
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  if (userData.nome || userData.endereco) {
    // Remove telefones mas mantém nome e endereço
    const cleanData = {
      nome: userData.nome,
      endereco: userData.endereco
    };
    localStorage.setItem('user', JSON.stringify(cleanData));
  }
  // Marca que a sessão está ativa
  sessionStorage.setItem('sessionActive', 'true');
}

// Event listener para botão voltar
document.getElementById('btn-voltar').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Carregar dados existentes
// Nome e endereço persistem entre sessões (localStorage)
// Telefones são apenas da sessão atual (sessionStorage)
const user = JSON.parse(localStorage.getItem('user')) || {};
const sessionData = JSON.parse(sessionStorage.getItem('sessionUser')) || {};

document.getElementById('del-nome').value = user.nome || '';
document.getElementById('del-telefone').value = sessionData.telefone || '';
document.getElementById('del-telefone-adicional').value = sessionData.telefoneAdicional || '';

if (user.endereco) {
  document.getElementById('del-cep').value = user.endereco.cep || '';
  document.getElementById('del-rua').value = user.endereco.rua || '';
  document.getElementById('del-numero').value = user.endereco.numero || '';
  document.getElementById('del-bairro').value = user.endereco.bairro || '';
  document.getElementById('del-cidade').value = user.endereco.cidade || '';
  document.getElementById('del-referencia').value = user.endereco.referencia || '';
}

// Garantir que todas as mensagens de erro começam ocultas
document.querySelectorAll('.error-message, .success-message').forEach(msg => {
  msg.style.display = 'none';
});

// Configurar validações em tempo real com mensagens de erro
setupNameValidationWithError('del-nome', 'nome-error-numbers', 'nome-error-incomplete');
setupPhoneValidationWithError('del-telefone', 'telefone-error-letters', 'telefone-error-incomplete');
setupPhoneValidationWithError('del-telefone-adicional', 'telefone-adicional-error-letters', 'telefone-adicional-error-incomplete', true);
// CEP é opcional - apenas aplica máscara e sanitização, sem validação obrigatória
setupFieldValidation('del-cep', null, maskCEP);
setupFieldValidationWithError('del-rua', (v) => v && v.length > 1, capitalizeAsYouType, 'rua-error');
setupFieldValidation('del-numero', validateNumber);
setupBairroValidationWithError('del-bairro', 'bairro-error-numbers', 'bairro-error-incomplete');
setupCidadeValidationWithError('del-cidade', 'cidade-error-numbers', 'cidade-error-incomplete');
setupFieldValidation('del-referencia', () => true, capitalizeAsYouType);

// Buscar CEP
const cepField = document.getElementById('del-cep');
const btnBuscarCep = document.getElementById('btn-buscar-cep');
const cepLoading = document.getElementById('cep-loading');
const cepError = document.getElementById('cep-error');

async function buscarCEP() {
  const cep = cepField.value.replace(/\D/g, '');
  
  if (cep.length !== 8) {
    alert('❌ Digite um CEP válido com 8 dígitos');
    cepField.focus();
    return;
  }
  
  cepLoading.classList.add('show');
  cepError.classList.remove('show');
  btnBuscarCep.disabled = true;
  
  const result = await searchCEP(cep);
  
  cepLoading.classList.remove('show');
  btnBuscarCep.disabled = false;
  
  if (result) {
    document.getElementById('del-rua').value = capitalizeAsYouType(result.rua || '');
    document.getElementById('del-bairro').value = capitalizeAsYouType(result.bairro || '');
    document.getElementById('del-cidade').value = capitalizeAsYouType(result.cidade || '');
    document.getElementById('del-numero').focus();
  } else {
    cepError.classList.add('show');
    alert('❌ CEP não encontrado. Verifique o número digitado.');
  }
}

btnBuscarCep.addEventListener('click', buscarCEP);
cepField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    buscarCEP();
  }
});

// Salvar e ir para pagamento
document.getElementById('delivery-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nome = document.getElementById('del-nome').value.trim();
  const telefone = document.getElementById('del-telefone').value.trim();
  const telefoneAdicional = document.getElementById('del-telefone-adicional').value.trim();
  const cep = document.getElementById('del-cep').value.trim();
  const rua = document.getElementById('del-rua').value.trim();
  const numero = document.getElementById('del-numero').value.trim();
  const bairro = document.getElementById('del-bairro').value.trim();
  const cidade = document.getElementById('del-cidade').value.trim();
  const referencia = document.getElementById('del-referencia').value.trim();
  
  // Validações
  if (!validateName(nome)) {
    alert('❌ Nome inválido');
    document.getElementById('del-nome').focus();
    return;
  }
  
  if (!validatePhone(telefone)) {
    alert('❌ Telefone inválido');
    document.getElementById('del-telefone').focus();
    return;
  }
  
  if (telefoneAdicional && !validatePhone(telefoneAdicional)) {
    alert('❌ Telefone adicional inválido');
    document.getElementById('del-telefone-adicional').focus();
    return;
  }
  
  // CEP é opcional - não valida
  // Campos de endereço são obrigatórios independente do CEP
  
  if (!rua || rua.length <= 1) {
    alert('❌ Por favor, insira a rua completa');
    document.getElementById('del-rua').focus();
    return;
  }
  
  if (!rua || rua.length <= 1) {
    alert('❌ Por favor, insira a rua completa');
    document.getElementById('del-rua').focus();
    return;
  }
  
  if (!numero) {
    alert('❌ Número inválido');
    document.getElementById('del-numero').focus();
    return;
  }
  
  // Validação específica de bairro (não pode ter números e mais de 1 caractere)
  if (!bairro) {
    alert('❌ Por favor, insira o bairro');
    document.getElementById('del-bairro').focus();
    return;
  }
  
  if (/\d/.test(bairro)) {
    alert('❌ O bairro não pode conter números');
    document.getElementById('del-bairro').focus();
    return;
  }
  
  if (bairro.length <= 1) {
    alert('❌ Por favor, insira o bairro completo');
    document.getElementById('del-bairro').focus();
    return;
  }
  
  // Validação específica de cidade (não pode ter números e mínimo 3 caracteres)
  if (!cidade) {
    alert('❌ Por favor, insira a cidade');
    document.getElementById('del-cidade').focus();
    return;
  }
  
  if (/\d/.test(cidade)) {
    alert('❌ A cidade não pode conter números');
    document.getElementById('del-cidade').focus();
    return;
  }
  
  if (cidade.length < 3) {
    alert('❌ Por favor, insira a cidade completa');
    document.getElementById('del-cidade').focus();
    return;
  }
  
  // ===== VERIFICAÇÃO DO CARRINHO NO MOMENTO DO CLIQUE =====
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  console.log('🛒 [FINALIZAR PEDIDO] Verificando carrinho:', cart);
  console.log('📊 [FINALIZAR PEDIDO] Quantidade de itens:', cart.length);
  
  if (!cart || cart.length === 0) {
    console.error('❌ [FINALIZAR PEDIDO] Carrinho está vazio!');
    alert('❌ Seu carrinho está vazio! Adicione itens antes de finalizar.');
    window.location.href = 'index.html';
    return;
  }
  
  console.log('✅ [FINALIZAR PEDIDO] Carrinho válido, continuando...');
  // =========================================================
  
  const userData = {
    nome: capitalizeName(nome),
    telefone,
    telefoneAdicional: telefoneAdicional || null,
    endereco: { cep, rua, numero, bairro, cidade, referencia }
  };
  
  // Salva nome e endereço no localStorage (persistem entre sessões)
  const persistentData = {
    nome: userData.nome,
    endereco: userData.endereco
  };
  localStorage.setItem('user', JSON.stringify(persistentData));
  
  // Salva telefones apenas na sessão (limpa ao fechar navegador)
  const sessionData = {
    telefone: userData.telefone,
    telefoneAdicional: userData.telefoneAdicional
  };
  sessionStorage.setItem('sessionUser', JSON.stringify(sessionData));
  
  // Salva dados completos também no localStorage para compatibilidade com outras páginas
  localStorage.setItem('user', JSON.stringify(userData));
  
  window.location.href = 'pagamento.html';
});
