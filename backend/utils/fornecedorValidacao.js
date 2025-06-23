// Valida se o nome não contém números
export const validarNomeFantasia = (nome_fantasia) => {
    return /^[A-Za-zÀ-ÿ\s]+$/.test(nome_fantasia);
};

// Valida se o e-mail tem um formato válido
export const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Valida se o telefone contém apenas números e tem pelo menos 10 dígitos
export const validarTelefone = (telefone) => {
    telefone = telefone.replace(/\D/g, ''); // Remove tudo que não for número
    return /^\d{10,11}$/.test(telefone);
};


// Formatação do telefone
export const formatarTelefone = (telefone) => {
    // Remove tudo que não for número
    telefone = telefone.replace(/\D/g, '');

    if (telefone.length === 11) {
        // Formato com 9 dígitos (celular): (00) 00000-0000
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (telefone.length === 10) {
        // Formato com 8 dígitos (fixo): (00) 0000-0000
        return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        return telefone; // Se não for 10 ou 11 dígitos, retorna como está
    }
}

// Valida se o CNPJ é válido
export const validarCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos.charAt(1));
};

// Formata CNPJ para o padrão 00.000.000/0000-00
export const formatarCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return cnpj;
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

// Valida se o cep contém apenas números
export const validarCep = (cep) => {
    return /^\d+$/.test(cep);
};

// Valida se a rua não contém números
export const validarRua = (rua) => {
    return /^[A-Za-zÀ-ÿ\s]+$/.test(rua);
};

// Valida se o bairro não contém números
export const validarBairro = (bairro) => {
    return /^[A-Za-zÀ-ÿ\s]+$/.test(bairro);
};

// Valida se a cidade não contém números
export const validarCidade = (cidade) => {
    return /^[A-Za-zÀ-ÿ\s]+$/.test(cidade);
};

// Valida se o número não contém letras
export const validarNumeroEndereco = (numero) => {
    return /^\d+$/.test(numero);
};