
// ===============================================
// VALIDAÇÕES DE FORMULÁRIO
// Compatível com: Chrome, Firefox, Safari, Edge, Opera
// Navegadores móveis: Chrome Mobile, Safari Mobile, Samsung Internet
// ===============================================

// Oculta todas as mensagens de erro ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
  // Oculta todas as mensagens de erro genéricas
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(function(el) {
    el.style.display = 'none';
  });
  // Oculta mensagens de erro específicas do campo rua (por id ou classe)
  const ruaErrorById = document.getElementById('error-rua');
  if (ruaErrorById) ruaErrorById.style.display = 'none';
  const ruaErrorByClass = document.querySelectorAll('.error-rua');
  ruaErrorByClass.forEach(function(el) {
    el.style.display = 'none';
  });
});

/**
 * Remove emojis, links e caracteres não identificáveis (mantém espaços)
 * Compatível com todos os navegadores modernos usando regex Unicode
 */
function sanitizeInput(value) {
  if (!value) return '';
  
  // Remove emojis
  value = value.replace(/[\u{1F600}-\u{1F64F}]/gu, ''); // Emoticons
  value = value.replace(/[\u{1F300}-\u{1F5FF}]/gu, ''); // Símbolos e pictogramas
  value = value.replace(/[\u{1F680}-\u{1F6FF}]/gu, ''); // Transporte
  value = value.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, ''); // Bandeiras
  value = value.replace(/[\u{2600}-\u{26FF}]/gu, ''); // Símbolos diversos
  value = value.replace(/[\u{2700}-\u{27BF}]/gu, ''); // Dingbats
  value = value.replace(/[\u{FE00}-\u{FE0F}]/gu, ''); // Seletores de variação
  value = value.replace(/[\u{1F900}-\u{1F9FF}]/gu, ''); // Símbolos suplementares
  
  // Remove URLs/links
  value = value.replace(/https?:\/\/[^\s]+/gi, '');
  value = value.replace(/www\.[^\s]+/gi, '');
  
  // Remove caracteres de controle (mas mantém espaços, tabs e quebras de linha normais)
  value = value.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');
  
  // Normaliza múltiplos espaços em um único espaço
  value = value.replace(/\s+/g, ' ');
  
  return value;
}

/**
 * Capitaliza a primeira letra de cada palavra em tempo real
 */
function capitalizeAsYouType(name) {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Capitaliza a primeira letra de cada palavra (Nome Próprio)
 */
function capitalizeName(name) {
  if (!name) return '';
  
  // Preserva espaços múltiplos durante o processamento
  return name
    .split(' ')
    .map(word => {
      if (word.length === 0) return '';
      // Mantém preposições em minúsculo
      if (['de', 'da', 'do', 'dos', 'das', 'e'].includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .filter(word => word.length > 0) // Remove palavras vazias
    .join(' ');
}

/**
 * Aplica máscara de telefone brasileiro: (XX) 9XXXX-XXXX ou (XX) XXXX-XXXX
 */
function maskPhone(value) {
  if (!value) return '';
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Aplica máscara conforme quantidade de dígitos
  if (numbers.length <= 2) {
    return `(${numbers}`;
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
}

/**
 * Aplica máscara de CEP: XXXXX-XXX
 */
function maskCEP(value) {
  if (!value) return '';
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 8 dígitos
  const limited = numbers.slice(0, 8);
  
  // Retorna vazio se não tiver números
  if (limited.length === 0) return '';
  
  // Retorna apenas os números se tiver 5 ou menos
  if (limited.length <= 5) {
    return limited;
  }
  
  // Adiciona o traço apenas entre os números que existem
  return `${limited.slice(0, 5)}-${limited.slice(5)}`;
}

/**
 * Valida CEP brasileiro
 */
function validateCEP(value) {
  if (!value) return false;
  
  // Verifica se contém letras
  if (/[a-zA-Z]/.test(value)) {
    return false;
  }
  
  const numbers = value.replace(/\D/g, '');
  return numbers.length === 8;
}

/**
 * Busca endereço pelo CEP usando API ViaCEP
 */
async function searchCEP(cep) {
  const numbers = cep.replace(/\D/g, '');
  
  if (numbers.length !== 8) {
    return null;
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${numbers}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return null;
    }
    
    return {
      cep: data.cep,
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
}

/**
 * Valida telefone brasileiro
 */
function validatePhone(value) {
  if (!value) return false;
  
  // Verifica se contém letras
  if (/[a-zA-Z]/.test(value)) {
    return false;
  }
  
  const numbers = value.replace(/\D/g, '');
  
  // Aceita: (XX) 9XXXX-XXXX (11 dígitos) ou (XX) XXXX-XXXX (10 dígitos)
  if (numbers.length !== 10 && numbers.length !== 11) {
    return false;
  }
  
  // Se tiver 11 dígitos, o terceiro deve ser 9
  if (numbers.length === 11 && numbers.charAt(2) !== '9') {
    return false;
  }
  
  return true;
}

/**
 * Valida nome (apenas letras e espaços)
 */
function validateName(value) {
  if (!value) return false;
  
  // Verifica se contém números
  if (/\d/.test(value)) {
    return false;
  }
  
  // Deve ter pelo menos 3 caracteres
  if (value.trim().length < 3) return false;
  
  // Apenas letras, espaços e acentos
  const regex = /^[a-zA-ZÀ-ÿ\s]+$/;
  return regex.test(value.trim());
}

/**
 * Valida endereço (rua, bairro, cidade)
 */
function validateAddress(value) {
  if (!value) return false;
  
  // Deve ter pelo menos 3 caracteres
  if (value.length < 3) return false;
  
  // Aceita letras, números, espaços e alguns caracteres especiais comuns em endereços
  const regex = /^[a-zA-Z0-9À-ÿ\s\.\,\-\/]+$/;
  return regex.test(value);
}

/**
 * Valida número do endereço
 */
function validateNumber(value) {
  if (!value) return false;
  
  // Aceita números, letras ou "S/N" (sem número)
  const regex = /^[a-zA-Z0-9\s\/\-]+$/i;
  return regex.test(value);
}

/**
 * Configura validação em tempo real para um campo
 */
function setupFieldValidation(fieldId, validationFn, formatFn = null) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  // Sanitiza na entrada
  field.addEventListener('input', (e) => {
    let value = e.target.value;
    const oldLength = value.length;
    
    // Sanitiza (permite espaços)
    value = sanitizeInput(value);
    
    // Aplica formatação em tempo real se houver
    if (formatFn) {
      value = formatFn(value);
    }
    
    const newLength = value.length;
    
    e.target.value = value;
    
    // Calcula nova posição do cursor baseado na diferença de tamanho
    const cursorPosition = e.target.selectionStart + (newLength - oldLength);
    
    // Posiciona cursor no final se a string cresceu (máscara adicionou caracteres)
    if (newLength > oldLength) {
      e.target.setSelectionRange(newLength, newLength);
    } else {
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    }
    
    // Valida apenas se tem conteúdo
    if (value) {
      const isValid = validationFn ? validationFn(value) : true;
      e.target.setAttribute('aria-invalid', !isValid);
      
      // Feedback visual
      if (!isValid) {
        e.target.style.borderColor = '#f44336';
      } else {
        e.target.style.borderColor = '';
      }
    } else {
      e.target.style.borderColor = '';
      e.target.setAttribute('aria-invalid', 'false');
    }
  });
  
  // Valida ao sair do campo
  field.addEventListener('blur', (e) => {
    const value = e.target.value;
    
    // Valida
    if (value) {
      const isValid = validationFn ? validationFn(value) : true;
      
      if (!isValid) {
        e.target.style.borderColor = '#f44336';
        e.target.setAttribute('aria-invalid', 'true');
      }
    }
  });
}

/**
 * Configura validação em tempo real para um campo com mensagem de erro
 */
function setupFieldValidationWithError(fieldId, validationFn, formatFn = null, errorElementId = null) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  const errorElement = errorElementId ? document.getElementById(errorElementId) : null;
  
  // Sanitiza na entrada
  field.addEventListener('input', (e) => {
    let value = e.target.value;
    const oldLength = value.length;
    
    // Sanitiza (permite espaços)
    value = sanitizeInput(value);
    
    // Aplica formatação em tempo real se houver
    if (formatFn) {
      value = formatFn(value);
    }
    
    const newLength = value.length;
    
    e.target.value = value;
    
    // Calcula nova posição do cursor baseado na diferença de tamanho
    const cursorPosition = e.target.selectionStart + (newLength - oldLength);
    
    // Posiciona cursor no final se a string cresceu (máscara adicionou caracteres)
    if (newLength > oldLength) {
      e.target.setSelectionRange(newLength, newLength);
    } else {
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    }
    
    // Valida apenas se tem conteúdo
    if (value) {
      const isValid = validationFn ? validationFn(value) : true;
      e.target.setAttribute('aria-invalid', !isValid);
      
      // Feedback visual na borda (sem mensagem de erro durante digitação)
      if (!isValid) {
        e.target.style.borderColor = '#f44336';
      } else {
        e.target.style.borderColor = '';
        // Remove mensagem de erro se o campo ficar válido
        if (errorElement) {
          errorElement.style.display = 'none';
        }
      }
    } else {
      e.target.style.borderColor = '';
      e.target.setAttribute('aria-invalid', 'false');
      // Remove mensagem de erro se o campo ficar vazio
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    }
  });
  
  // Valida ao sair do campo (blur) - verifica se está completo
  field.addEventListener('blur', (e) => {
    const value = e.target.value;
    
    // Valida
    if (value) {
      const isValid = validationFn ? validationFn(value) : true;
      
      if (!isValid) {
        e.target.style.borderColor = '#f44336';
        e.target.setAttribute('aria-invalid', 'true');
        
        // Mostra mensagem de erro
        if (errorElement) {
          errorElement.style.display = 'block';
        }
      } else {
        e.target.style.borderColor = '';
        e.target.setAttribute('aria-invalid', 'false');
        if (errorElement) {
          errorElement.style.display = 'none';
        }
      }
    } else {
      // Campo vazio - remove erro
      e.target.style.borderColor = '';
      e.target.setAttribute('aria-invalid', 'false');
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    }
  });
}

/**
 * Configura validação específica para campos de telefone com mensagens de erro diferenciadas
 */
function setupPhoneValidationWithError(fieldId, errorLettersId, errorIncompleteId, isOptional = false) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  const errorLetters = document.getElementById(errorLettersId);
  const errorIncomplete = document.getElementById(errorIncompleteId);
  
  // Sanitiza e aplica máscara na entrada
  field.addEventListener('input', (e) => {
    let value = e.target.value;
    const oldLength = value.length;
    value = sanitizeInput(value);
    value = maskPhone(value);
    const newLength = value.length;
    e.target.value = value;
    const cursorPosition = e.target.selectionStart + (newLength - oldLength);
    if (newLength > oldLength) {
      e.target.setSelectionRange(newLength, newLength);
    } else {
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    }
    if (!value) {
      e.target.style.borderColor = '';
      e.target.setAttribute('aria-invalid', 'false');
      if (errorLetters) errorLetters.style.display = 'none';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
      return;
    }
    const hasLetters = /[a-zA-Z]/.test(value);
    if (hasLetters) {
      e.target.style.borderColor = '#f44336';
      e.target.setAttribute('aria-invalid', 'true');
      if (errorLetters) errorLetters.style.display = 'block';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
    } else {
      const isValid = validatePhone(value);
      e.target.setAttribute('aria-invalid', !isValid);
      e.target.style.borderColor = isValid ? '' : '#f44336';
      if (!isValid) {
        if (errorIncomplete) errorIncomplete.style.display = 'block';
        if (errorLetters) errorLetters.style.display = 'none';
      } else {
        if (errorIncomplete) errorIncomplete.style.display = 'none';
        if (errorLetters) errorLetters.style.display = 'none';
      }
    }
  });
  
  // Valida ao sair do campo (blur)
  field.addEventListener('blur', (e) => {
    const value = e.target.value;
    if (!value) {
      e.target.style.borderColor = '';
      e.target.setAttribute('aria-invalid', 'false');
      if (errorLetters) errorLetters.style.display = 'none';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
      return;
    }
    const hasLetters = /[a-zA-Z]/.test(value);
    if (hasLetters) {
      e.target.style.borderColor = '#f44336';
      e.target.setAttribute('aria-invalid', 'true');
      if (errorLetters) errorLetters.style.display = 'block';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
    } else {
      const numbers = value.replace(/\D/g, '');
      const isValid = numbers.length === 10 || numbers.length === 11;
      if (!isValid) {
        e.target.style.borderColor = '#f44336';
        e.target.setAttribute('aria-invalid', 'true');
        if (errorIncomplete) errorIncomplete.style.display = 'block';
        if (errorLetters) errorLetters.style.display = 'none';
      } else {
        e.target.style.borderColor = '';
        e.target.setAttribute('aria-invalid', 'false');
        if (errorLetters) errorLetters.style.display = 'none';
        if (errorIncomplete) errorIncomplete.style.display = 'none';
      }
    }
  });
}

/**
 * Configura validação específica para campo de nome com mensagens de erro diferenciadas
 */
function setupNameValidationWithError(fieldId, errorNumbersId, errorIncompleteId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  const errorNumbers = document.getElementById(errorNumbersId);
  const errorIncomplete = document.getElementById(errorIncompleteId);
  
  // Sanitiza e aplica capitalização na entrada (SEM mostrar mensagens durante digitação)
  field.addEventListener('input', (e) => {
    let value = e.target.value;
    const oldLength = value.length;
    value = sanitizeInput(value);
    value = capitalizeAsYouType(value);
    const newLength = value.length;
    e.target.value = value;
    const cursorPosition = e.target.selectionStart + (newLength - oldLength);
    if (newLength > oldLength) {
      e.target.setSelectionRange(newLength, newLength);
    } else {
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    }
    
    // Remove mensagens de erro durante a digitação
    if (errorNumbers) errorNumbers.style.display = 'none';
    if (errorIncomplete) errorIncomplete.style.display = 'none';
    
    // Apenas feedback visual na borda
    if (!value) {
      e.target.style.borderColor = '';
      e.target.setAttribute('aria-invalid', 'false');
    } else {
      const hasNumbers = /\d/.test(value);
      const isValid = !hasNumbers && value.length >= 3;
      e.target.style.borderColor = isValid ? '' : '#f44336';
      e.target.setAttribute('aria-invalid', !isValid);
    }
  });
  
  // Valida ao sair do campo (blur) - AQUI SIM mostra as mensagens
  field.addEventListener('blur', (e) => {
    const value = e.target.value;
    if (!value) {
      e.target.style.borderColor = '';
      e.target.setAttribute('aria-invalid', 'false');
      if (errorNumbers) errorNumbers.style.display = 'none';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
      return;
    }
    const hasNumbers = /\d/.test(value);
    if (hasNumbers) {
      e.target.style.borderColor = '#f44336';
      e.target.setAttribute('aria-invalid', 'true');
      if (errorNumbers) errorNumbers.style.display = 'block';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
    } else {
      const isValid = validateName(value);
      if (!isValid) {
        e.target.style.borderColor = '#f44336';
        e.target.setAttribute('aria-invalid', 'true');
        if (errorIncomplete) errorIncomplete.style.display = 'block';
        if (errorNumbers) errorNumbers.style.display = 'none';
      } else {
        e.target.style.borderColor = '';
        e.target.setAttribute('aria-invalid', 'false');
        if (errorNumbers) errorNumbers.style.display = 'none';
        if (errorIncomplete) errorIncomplete.style.display = 'none';
      }
    }
  });
}

/**
 * Configura validação específica para campo de CEP com mensagens de erro diferenciadas
 */
function setupCepValidationWithError(fieldId, errorLettersId, errorIncompleteId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  const errorLetters = document.getElementById(errorLettersId);
  const errorIncomplete = document.getElementById(errorIncompleteId);
  
  // Sanitiza e aplica máscara na entrada
  field.addEventListener('input', (e) => {
    let value = e.target.value;
    const oldLength = value.length;
    value = sanitizeInput(value);
    value = maskCEP(value);
    const newLength = value.length;
    e.target.value = value;
    const cursorPosition = e.target.selectionStart + (newLength - oldLength);
    if (newLength > oldLength) {
      e.target.setSelectionRange(newLength, newLength);
    } else {
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    }
    if (!value) {
      e.target.style.borderColor = '';
      e.target.setAttribute('aria-invalid', 'false');
      if (errorLetters) errorLetters.style.display = 'none';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
      return;
    }
    const hasLetters = /[a-zA-Z]/.test(value);
    if (hasLetters) {
      e.target.style.borderColor = '#f44336';
      e.target.setAttribute('aria-invalid', 'true');
      if (errorLetters) errorLetters.style.display = 'block';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
    } else {
      const isValid = validateCEP(value);
      e.target.setAttribute('aria-invalid', !isValid);
      e.target.style.borderColor = isValid ? '' : '#f44336';
      if (!isValid) {
        if (errorIncomplete) errorIncomplete.style.display = 'block';
        if (errorLetters) errorLetters.style.display = 'none';
      } else {
        if (errorIncomplete) errorIncomplete.style.display = 'none';
        if (errorLetters) errorLetters.style.display = 'none';
      }
    }
  });
  
  // Valida ao sair do campo (blur)
  field.addEventListener('blur', (e) => {
    const value = e.target.value;
    if (!value) {
      e.target.style.borderColor = '';
      e.target.setAttribute('aria-invalid', 'false');
      if (errorLetters) errorLetters.style.display = 'none';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
      return;
    }
    const hasLetters = /[a-zA-Z]/.test(value);
    if (hasLetters) {
      e.target.style.borderColor = '#f44336';
      e.target.setAttribute('aria-invalid', 'true');
      if (errorLetters) errorLetters.style.display = 'block';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
    } else {
      const numbers = value.replace(/\D/g, '');
      const isValid = numbers.length === 8;
      if (!isValid) {
        e.target.style.borderColor = '#f44336';
        e.target.setAttribute('aria-invalid', 'true');
        if (errorIncomplete) errorIncomplete.style.display = 'block';
        if (errorLetters) errorLetters.style.display = 'none';
      } else {
        e.target.style.borderColor = '';
        e.target.setAttribute('aria-invalid', 'false');
        if (errorLetters) errorLetters.style.display = 'none';
        if (errorIncomplete) errorIncomplete.style.display = 'none';
      }
    }
  });
}

/**
 * Configura validação específica para campo de cidade com mensagens de erro diferenciadas
 */
function setupCidadeValidationWithError(fieldId, errorNumbersId, errorIncompleteId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  const errorNumbers = document.getElementById(errorNumbersId);
  const errorIncomplete = document.getElementById(errorIncompleteId);
  
  // Sanitiza e aplica capitalização na entrada
  field.addEventListener('input', (e) => {
    let value = e.target.value;
    const oldLength = value.length;
    value = sanitizeInput(value);
    value = capitalizeAsYouType(value);
    const newLength = value.length;
    e.target.value = value;
    const cursorPosition = e.target.selectionStart + (newLength - oldLength);
    if (newLength > oldLength) {
      e.target.setSelectionRange(newLength, newLength);
    } else {
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    }
    if (!value) {
      e.target.style.borderColor = '';
      e.target.setAttribute('aria-invalid', 'false');
      if (errorNumbers) errorNumbers.style.display = 'none';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
      return;
    }
    const hasNumbers = /\d/.test(value);
    if (hasNumbers) {
      e.target.style.borderColor = '#f44336';
      e.target.setAttribute('aria-invalid', 'true');
      if (errorNumbers) errorNumbers.style.display = 'block';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
    } else {
      const isValid = value.length >= 3;
      e.target.setAttribute('aria-invalid', !isValid);
      e.target.style.borderColor = isValid ? '' : '#f44336';
      if (!isValid) {
        if (errorIncomplete) errorIncomplete.style.display = 'block';
        if (errorNumbers) errorNumbers.style.display = 'none';
      } else {
        if (errorIncomplete) errorIncomplete.style.display = 'none';
        if (errorNumbers) errorNumbers.style.display = 'none';
      }
    }
  });
  
  // Valida ao sair do campo (blur)
  field.addEventListener('blur', (e) => {
    const value = e.target.value;
    if (!value) {
      e.target.style.borderColor = '';
      e.target.setAttribute('aria-invalid', 'false');
      if (errorNumbers) errorNumbers.style.display = 'none';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
      return;
    }
    const hasNumbers = /\d/.test(value);
    if (hasNumbers) {
      e.target.style.borderColor = '#f44336';
      e.target.setAttribute('aria-invalid', 'true');
      if (errorNumbers) errorNumbers.style.display = 'block';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
    } else {
      const isValid = value.length >= 3;
      if (!isValid) {
        e.target.style.borderColor = '#f44336';
        e.target.setAttribute('aria-invalid', 'true');
        if (errorIncomplete) errorIncomplete.style.display = 'block';
        if (errorNumbers) errorNumbers.style.display = 'none';
      } else {
        e.target.style.borderColor = '';
        e.target.setAttribute('aria-invalid', 'false');
        if (errorNumbers) errorNumbers.style.display = 'none';
        if (errorIncomplete) errorIncomplete.style.display = 'none';
      }
    }
  });
}


/**
 * Configura validação específica para campo de bairro com mensagens de erro diferenciadas
 */
function setupBairroValidationWithError(fieldId, errorNumbersId, errorIncompleteId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  const errorNumbers = document.getElementById(errorNumbersId);
  const errorIncomplete = document.getElementById(errorIncompleteId);
  
  // Sanitiza e aplica capitalização na entrada
  field.addEventListener('input', (e) => {
    let value = e.target.value;
    const oldLength = value.length;
    value = sanitizeInput(value);
    value = capitalizeAsYouType(value);
    const newLength = value.length;
    e.target.value = value;
    const cursorPosition = e.target.selectionStart + (newLength - oldLength);
    if (newLength > oldLength) {
      e.target.setSelectionRange(newLength, newLength);
    } else {
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    }
    if (!value) {
      e.target.style.borderColor = '';
      e.target.setAttribute('aria-invalid', 'false');
      if (errorNumbers) errorNumbers.style.display = 'none';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
      return;
    }
    const hasNumbers = /\d/.test(value);
    if (hasNumbers) {
      e.target.style.borderColor = '#f44336';
      e.target.setAttribute('aria-invalid', 'true');
      if (errorNumbers) errorNumbers.style.display = 'block';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
    } else {
      const isValid = value.length > 1;
      e.target.setAttribute('aria-invalid', !isValid);
      e.target.style.borderColor = isValid ? '' : '#f44336';
      if (!isValid) {
        if (errorIncomplete) errorIncomplete.style.display = 'block';
        if (errorNumbers) errorNumbers.style.display = 'none';
      } else {
        if (errorIncomplete) errorIncomplete.style.display = 'none';
        if (errorNumbers) errorNumbers.style.display = 'none';
      }
    }
  });
  
  // Valida ao sair do campo (blur)
  field.addEventListener('blur', (e) => {
    const value = e.target.value;
    if (!value) {
      e.target.style.borderColor = '';
      e.target.setAttribute('aria-invalid', 'false');
      if (errorNumbers) errorNumbers.style.display = 'none';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
      return;
    }
    const hasNumbers = /\d/.test(value);
    if (hasNumbers) {
      e.target.style.borderColor = '#f44336';
      e.target.setAttribute('aria-invalid', 'true');
      if (errorNumbers) errorNumbers.style.display = 'block';
      if (errorIncomplete) errorIncomplete.style.display = 'none';
    } else {
      const isValid = value.length > 1;
      if (!isValid) {
        e.target.style.borderColor = '#f44336';
        e.target.setAttribute('aria-invalid', 'true');
        if (errorIncomplete) errorIncomplete.style.display = 'block';
        if (errorNumbers) errorNumbers.style.display = 'none';
      } else {
        e.target.style.borderColor = '';
        e.target.setAttribute('aria-invalid', 'false');
        if (errorNumbers) errorNumbers.style.display = 'none';
        if (errorIncomplete) errorIncomplete.style.display = 'none';
      }
    }
  });
}
