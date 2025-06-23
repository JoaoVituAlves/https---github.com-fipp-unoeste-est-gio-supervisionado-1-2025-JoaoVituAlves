// Valida se o nome não contém números
export const validarNome = (nome) => {
    return /^[A-Za-zÀ-ÿ\s]+$/.test(nome);
};

// Valida se o e-mail tem um formato válido
export const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Valida se o CPF tem o formato correto e dígitos válidos
export const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let dig1 = 11 - (soma % 11);
    if (dig1 >= 10) dig1 = 0;
    if (dig1 !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let dig2 = 11 - (soma % 11);
    if (dig2 >= 10) dig2 = 0;
    if (dig2 !== parseInt(cpf.charAt(10))) return false;

    return true;
};

// Formata CPF para o padrão 000.000.000-00
export const formatarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return cpf;
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

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

// Valida se a inscrição estadual contém apenas números
export const validarInscricaoEstadual = (insc_estadual) => {
    return /^\d+$/.test(insc_estadual);
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

// Valida se a senha tem no mínimo 6 caracteres, 1 maiúscula, 1 símbolo, sem acento e sem espaço
export const validarSenha = (senha) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{6,}$/;

    return (
        regex.test(senha)
    );
};

// Valida se as senhas são iguais
export const validarSenhas = (senha, confmSenha) => {
    return senha === confmSenha;
};

export const validarNovaSenha = (novaSenha) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{6,}$/;

    return (
        regex.test(novaSenha)
    );
};

// Valida se as novas senhas são iguais
export const validarNovasSenhas = (novaSenha, confmNovaSenha) => {
    return novaSenha === confmNovaSenha;
};

// Valida se as novas senhas redefinidas são iguais
export const validarSenhasRedefinidas = (novaSenha, confmNovaSenha) => {
    return novaSenha === confmNovaSenha;
};