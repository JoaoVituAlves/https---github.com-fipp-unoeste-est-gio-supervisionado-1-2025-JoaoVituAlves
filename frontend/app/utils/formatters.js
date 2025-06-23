/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado como moeda
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata uma data no formato brasileiro (DD/MM/YYYY)
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} - Data formatada
 */
export function formatDate(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
}

/**
 * Formata uma data com hora no formato brasileiro (DD/MM/YYYY HH:MM)
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} - Data e hora formatadas
 */
export function formatDateTime(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

/**
 * Formata um número de telefone brasileiro
 * @param {string} phone - Número de telefone a ser formatado
 * @returns {string} - Telefone formatado
 */
export function formatPhone(phone) {
  if (!phone) return '';
  
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Verifica se é celular (com 9 na frente) ou telefone fixo
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}

/**
 * Formata um CPF (XXX.XXX.XXX-XX)
 * @param {string} cpf - CPF a ser formatado
 * @returns {string} - CPF formatado
 */
export function formatCPF(cpf) {
  if (!cpf) return '';
  
  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return cpf;
  
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata um CEP (XXXXX-XXX)
 * @param {string} cep - CEP a ser formatado
 * @returns {string} - CEP formatado
 */
export function formatCEP(cep) {
  if (!cep) return '';
  
  // Remove caracteres não numéricos
  const cleaned = cep.replace(/\D/g, '');
  
  if (cleaned.length !== 8) return cep;
  
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
}