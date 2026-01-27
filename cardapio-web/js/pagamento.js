// Voltar para entrega
document.getElementById('btn-voltar').addEventListener('click', () => {
    window.location.href = 'entrega.html';
});

// Seleção de método de pagamento
let selectedPayment = null;

document.querySelectorAll('.pay-card').forEach(card => {
    card.addEventListener('click', function() {
        // Remove seleção anterior
        document.querySelectorAll('.pay-card').forEach(c => c.classList.remove('selected'));
        
        // Adiciona seleção atual
        this.classList.add('selected');
        
        // Armazena método selecionado
        const method = this.dataset.method;
        selectedPayment = {
            method: method,
            name: this.querySelector('.pay-title').textContent
        };
        
        // Renderiza detalhes do pagamento
        renderPaymentDetails(method);
    });
    
    // Adiciona suporte para teclado
    card.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

function renderPaymentDetails(method) {
    const detailsDiv = document.getElementById('payment-details');
    
    if (!detailsDiv) {
        console.error('payment-details div não encontrada!');
        return;
    }
    
    // Aguarda para garantir que o PaymentController terminou
    setTimeout(() => {
        // Limpa o conteúdo
        detailsDiv.innerHTML = '';
        
        if (method === 'dinheiro') {
            // Criar elementos
            const paymentDetail = document.createElement('div');
            paymentDetail.className = 'payment-detail';
            
            const label = document.createElement('label');
            label.htmlFor = 'troco';
            label.textContent = 'Troco para quanto? (Máximo R$ 200,00)';
            
            const trocoInput = document.createElement('input');
            trocoInput.type = 'text';
            trocoInput.id = 'troco';
            trocoInput.placeholder = 'R$ 0,00';
            trocoInput.maxLength = 10;
            trocoInput.inputMode = 'numeric';
            
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error';
            errorSpan.id = 'troco-error';
            
            // Checkbox sem troco
            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.className = 'checkbox-wrapper';
            checkboxWrapper.style.marginTop = '15px';
            checkboxWrapper.style.display = 'flex';
            checkboxWrapper.style.alignItems = 'center';
            
            const semTrocoCheckbox = document.createElement('input');
            semTrocoCheckbox.type = 'checkbox';
            semTrocoCheckbox.id = 'sem-troco';
            semTrocoCheckbox.style.marginRight = '8px';
            semTrocoCheckbox.style.cursor = 'pointer';
            
            const checkboxLabel = document.createElement('label');
            checkboxLabel.htmlFor = 'sem-troco';
            checkboxLabel.textContent = 'Sem troco';
            checkboxLabel.style.cursor = 'pointer';
            checkboxLabel.style.transition = 'font-weight 0.2s ease';
            
            checkboxWrapper.appendChild(semTrocoCheckbox);
            checkboxWrapper.appendChild(checkboxLabel);
            
            paymentDetail.appendChild(label);
            paymentDetail.appendChild(trocoInput);
            paymentDetail.appendChild(errorSpan);
            paymentDetail.appendChild(checkboxWrapper);
            detailsDiv.appendChild(paymentDetail);
            
            // Interação entre checkbox e input
            semTrocoCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    trocoInput.value = '';
                    trocoInput.disabled = true;
                    trocoInput.style.opacity = '0.5';
                    errorSpan.textContent = '';
                    checkboxLabel.style.fontWeight = 'bold';
                } else {
                    trocoInput.disabled = false;
                    trocoInput.style.opacity = '1';
                    checkboxLabel.style.fontWeight = 'normal';
                }
            });
            
            // Desmarcar checkbox ao digitar
            trocoInput.addEventListener('focus', function() {
                if (semTrocoCheckbox.checked) {
                    semTrocoCheckbox.checked = false;
                    this.disabled = false;
                    this.style.opacity = '1';
                    checkboxLabel.style.fontWeight = 'normal';
                }
            });
            
            // Formata o campo de troco como moeda
            trocoInput.addEventListener('input', function(e) {
                let value = e.target.value;
                
                // Remove tudo que não é número
                value = value.replace(/\D/g, '');
                
                // Se está vazio, limpa
                if (!value) {
                    e.target.value = '';
                    errorSpan.textContent = '';
                    return;
                }
                
                // Converte para número (centavos)
                let numValue = parseInt(value);
                
                // Limita a 20000 centavos (R$ 200,00)
                if (numValue > 20000) {
                    numValue = 20000;
                    errorSpan.textContent = 'Valor máximo: R$ 200,00';
                } else {
                    errorSpan.textContent = '';
                }
                
                // Divide por 100 para obter o valor em reais
                let reais = (numValue / 100).toFixed(2);
                
                // Substitui ponto por vírgula
                reais = reais.replace('.', ',');
                
                // Adiciona o prefixo R$
                e.target.value = 'R$ ' + reais;
            });
            
            trocoInput.addEventListener('blur', function(e) {
                if (!e.target.value || e.target.value === 'R$ 0,00') {
                    e.target.value = '';
                    errorSpan.textContent = '';
                }
            });
            
        } else if (method === 'pix') {
            detailsDiv.innerHTML = `
                <div class="payment-detail">
                    <p>✅ Enviaremos a chave PIX após a confirmação do pedido.</p>
                </div>
            `;
        } else {
            detailsDiv.innerHTML = `
                <div class="payment-detail">
                    <p>✅ A maquininha estará disponível na entrega.</p>
                </div>
            `;
        }
        
        // Adiciona a classe show para tornar o conteúdo visível
        detailsDiv.classList.add('show');
    }, 150);
}

// Finalizar pedido
document.getElementById('finish-order').addEventListener('click', () => {
    // Lê do localStorage (onde o carrinho é realmente salvo)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (!cart || cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.endereco) {
        alert('Por favor, preencha seus dados de entrega.');
        window.location.href = 'entrega.html';
        return;
    }
    
    if (!selectedPayment) {
        alert('Por favor, selecione uma forma de pagamento.');
        return;
    }
    
    // Validação específica para pagamento em dinheiro
    if (selectedPayment.method === 'dinheiro') {
        const trocoInput = document.getElementById('troco');
        const semTrocoCheckbox = document.getElementById('sem-troco');
        const trocoValue = trocoInput.value.replace('R$ ', '').replace(',', '.');
        const troco = parseFloat(trocoValue);
        
        // Calcular total usando customizedPrice ou price, e quantity
        const total = cart.reduce((sum, item) => {
            const price = item.customizedPrice || item.price;
            return sum + (price * item.quantity);
        }, 0);
        
        // Se checkbox "sem troco" está marcado, pula validação do troco
        if (semTrocoCheckbox && semTrocoCheckbox.checked) {
            selectedPayment.troco = 0;
            selectedPayment.semTroco = true;
        } else {
            // Validação normal do troco
            if (isNaN(troco) || troco <= 0) {
                document.getElementById('troco-error').textContent = 'Por favor, informe o valor do troco ou marque "Sem troco".';
                trocoInput.focus();
                return;
            }
            
            if (troco > 200) {
                document.getElementById('troco-error').textContent = 'O troco máximo é R$ 200,00.';
                trocoInput.focus();
                return;
            }
            
            if (troco <= total) {
                document.getElementById('troco-error').textContent = 'O troco deve ser maior que o valor total do pedido.';
                trocoInput.focus();
                return;
            }
            
            selectedPayment.troco = troco;
            selectedPayment.semTroco = false;
        }
    }
    
    // Calcular total usando customizedPrice ou price, e quantity
    const total = cart.reduce((sum, item) => {
        const price = item.customizedPrice || item.price;
        return sum + (price * item.quantity);
    }, 0);
    
    // Enviar para WhatsApp
    sendWhatsApp(user, selectedPayment, cart, total);
});

// Restaurar seleção anterior se existir
const previousPayment = sessionStorage.getItem('selectedPayment');
if (previousPayment) {
    const payment = JSON.parse(previousPayment);
    const card = document.querySelector(`.pay-card[data-method="${payment.method}"]`);
    if (card) {
        card.click();
    }
}
