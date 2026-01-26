/**
 * Utilitários de validação para formulários
 * Compatível com todos os navegadores modernos (Chrome, Firefox, Safari, Edge)
 */

/**
 * Remove emojis, URLs e caracteres de controle
 */
export function sanitizeInput(value: string): string {
  if (!value) return '';
  
  let sanitized = value;
  
  // Remove emojis
  sanitized = sanitized.replace(/[\u{1F600}-\u{1F64F}]/gu, ''); // Emoticons
  sanitized = sanitized.replace(/[\u{1F300}-\u{1F5FF}]/gu, ''); // Símbolos e pictogramas
  sanitized = sanitized.replace(/[\u{1F680}-\u{1F6FF}]/gu, ''); // Transporte e símbolos de mapa
  sanitized = sanitized.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, ''); // Bandeiras
  sanitized = sanitized.replace(/[\u{2600}-\u{26FF}]/gu, ''); // Símbolos diversos
  sanitized = sanitized.replace(/[\u{2700}-\u{27BF}]/gu, ''); // Dingbats
  sanitized = sanitized.replace(/[\u{FE00}-\u{FE0F}]/gu, ''); // Seletores de variação
  
  // Remove URLs
  sanitized = sanitized.replace(/https?:\/\/[^\s]+/gi, '');
  
  // Remove caracteres de controle
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
  
  return sanitized.trim();
}

/**
 * Valida nome completo
 * - Não pode conter números
 * - Mínimo 3 caracteres
 */
export function validateName(name: string): boolean {
  if (!name || name.length < 3) return false;
  
  // Verifica se contém números
  if (/\d/.test(name)) return false;
  
  return true;
}

/**
 * Valida telefone brasileiro
 * - Não pode conter letras
 * - Deve ter 10 ou 11 dígitos (completo)
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  
  // Remove formatação
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Verifica se contém letras
  if (/[a-zA-Z]/.test(phone)) return false;
  
  // Deve ter 10 ou 11 dígitos
  return digitsOnly.length === 10 || digitsOnly.length === 11;
}

/**
 * Valida CEP brasileiro
 * - Não pode conter letras
 * - Deve ter exatamente 8 dígitos
 */
export function validateCEP(cep: string): boolean {
  if (!cep) return false;
  
  // Remove formatação
  const digitsOnly = cep.replace(/\D/g, '');
  
  // Verifica se contém letras
  if (/[a-zA-Z]/.test(cep)) return false;
  
  // Deve ter exatamente 8 dígitos
  return digitsOnly.length === 8;
}

/**
 * Valida endereço genérico (rua, bairro, cidade)
 */
export function validateAddress(address: string): boolean {
  return !!(address && address.length > 0);
}

/**
 * Valida número de endereço
 * - Aceita letras e números (ex: "123A", "SN")
 */
export function validateNumber(numero: string): boolean {
  if (!numero) return false;
  return /^[a-zA-Z0-9\s\/-]+$/i.test(numero);
}

/**
 * Valida bairro
 * - Não pode conter números
 * - Mínimo 2 caracteres
 */
export function validateBairro(bairro: string): boolean {
  if (!bairro || bairro.length < 2) return false;
  
  // Verifica se contém números
  if (/\d/.test(bairro)) return false;
  
  return true;
}

/**
 * Valida cidade
 * - Não pode conter números
 * - Mínimo 3 caracteres
 */
export function validateCidade(cidade: string): boolean {
  if (!cidade || cidade.length < 3) return false;
  
  // Verifica se contém números
  if (/\d/.test(cidade)) return false;
  
  return true;
}

/**
 * Aplica máscara de telefone brasileiro
 */
export function maskPhone(value: string): string {
  if (!value) return '';
  
  const digitsOnly = value.replace(/\D/g, '');
  
  if (digitsOnly.length <= 2) {
    return digitsOnly;
  } else if (digitsOnly.length <= 6) {
    return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2)}`;
  } else if (digitsOnly.length <= 10) {
    return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 6)}-${digitsOnly.slice(6)}`;
  } else {
    return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 7)}-${digitsOnly.slice(7, 11)}`;
  }
}

/**
 * Aplica máscara de CEP
 */
export function maskCEP(value: string): string {
  if (!value) return '';
  
  const digitsOnly = value.replace(/\D/g, '');
  
  if (digitsOnly.length <= 5) {
    return digitsOnly;
  } else {
    return `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5, 8)}`;
  }
}

/**
 * Capitaliza primeira letra de cada palavra
 */
export function capitalizeAsYouType(value: string): string {
  if (!value) return '';
  
  return value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Capitaliza nome completo
 */
export function capitalizeName(name: string): string {
  if (!name) return '';
  
  const prepositions = ['da', 'de', 'do', 'das', 'dos', 'e'];
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (prepositions.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Tipos de erro de validação
 */
export const ValidationErrorType = {
  CONTAINS_NUMBERS: 'CONTAINS_NUMBERS',
  CONTAINS_LETTERS: 'CONTAINS_LETTERS',
  INCOMPLETE: 'INCOMPLETE',
  INVALID: 'INVALID',
  TOO_SHORT: 'TOO_SHORT',
} as const;

export type ValidationErrorType = typeof ValidationErrorType[keyof typeof ValidationErrorType];

/**
 * Resultado de validação com tipo de erro
 */
export interface ValidationResult {
  isValid: boolean;
  errorType?: typeof ValidationErrorType[keyof typeof ValidationErrorType];
  message?: string;
}

/**
 * Valida nome com detalhes do erro
 */
export function validateNameWithError(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      errorType: ValidationErrorType.INCOMPLETE,
      message: 'Por favor, informe o nome completo.',
    };
  }
  
  if (/\d/.test(name)) {
    return {
      isValid: false,
      errorType: ValidationErrorType.CONTAINS_NUMBERS,
      message: 'O nome não pode conter números. Por favor, informe o nome correto.',
    };
  }
  
  if (name.trim().length < 3) {
    return {
      isValid: false,
      errorType: ValidationErrorType.TOO_SHORT,
      message: 'Por favor, informe o nome completo.',
    };
  }
  
  return { isValid: true };
}

/**
 * Valida telefone com detalhes do erro
 */
export function validatePhoneWithError(phone: string): ValidationResult {
  if (!phone || phone.trim().length === 0) {
    return {
      isValid: false,
      errorType: ValidationErrorType.INCOMPLETE,
      message: 'O campo telefone está incompleto.',
    };
  }
  
  if (/[a-zA-Z]/.test(phone)) {
    return {
      isValid: false,
      errorType: ValidationErrorType.CONTAINS_LETTERS,
      message: 'O telefone não pode conter letras. Por favor, informe o telefone correto.',
    };
  }
  
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 10 || digitsOnly.length > 11) {
    return {
      isValid: false,
      errorType: ValidationErrorType.INCOMPLETE,
      message: 'O campo telefone está incompleto.',
    };
  }
  
  return { isValid: true };
}

/**
 * Valida CEP com detalhes do erro
 */
export function validateCEPWithError(cep: string): ValidationResult {
  if (!cep || cep.trim().length === 0) {
    return {
      isValid: false,
      errorType: ValidationErrorType.INCOMPLETE,
      message: 'O campo CEP está incompleto.',
    };
  }
  
  if (/[a-zA-Z]/.test(cep)) {
    return {
      isValid: false,
      errorType: ValidationErrorType.CONTAINS_LETTERS,
      message: 'O CEP não pode conter letras. Por favor, informe o CEP correto.',
    };
  }
  
  const digitsOnly = cep.replace(/\D/g, '');
  if (digitsOnly.length !== 8) {
    return {
      isValid: false,
      errorType: ValidationErrorType.INCOMPLETE,
      message: 'O campo CEP está incompleto.',
    };
  }
  
  return { isValid: true };
}

/**
 * Valida bairro com detalhes do erro
 */
export function validateBairroWithError(bairro: string): ValidationResult {
  if (!bairro || bairro.trim().length === 0) {
    return {
      isValid: false,
      errorType: ValidationErrorType.INCOMPLETE,
      message: 'Por favor, insira o bairro completo.',
    };
  }
  
  if (/\d/.test(bairro)) {
    return {
      isValid: false,
      errorType: ValidationErrorType.CONTAINS_NUMBERS,
      message: 'O bairro não pode conter números.',
    };
  }
  
  if (bairro.trim().length < 2) {
    return {
      isValid: false,
      errorType: ValidationErrorType.TOO_SHORT,
      message: 'Por favor, insira o bairro completo.',
    };
  }
  
  return { isValid: true };
}

/**
 * Valida cidade com detalhes do erro
 */
export function validateCidadeWithError(cidade: string): ValidationResult {
  if (!cidade || cidade.trim().length === 0) {
    return {
      isValid: false,
      errorType: ValidationErrorType.INCOMPLETE,
      message: 'Por favor, insira a cidade completa.',
    };
  }
  
  if (/\d/.test(cidade)) {
    return {
      isValid: false,
      errorType: ValidationErrorType.CONTAINS_NUMBERS,
      message: 'A cidade não pode conter números.',
    };
  }
  
  if (cidade.trim().length < 3) {
    return {
      isValid: false,
      errorType: ValidationErrorType.TOO_SHORT,
      message: 'Por favor, insira a cidade completa.',
    };
  }
  
  return { isValid: true };
}
