//Validações do funcionário

// Valida se a data de admissão é válida e não está no futuro
export const validarDataAdmissao = (data) => {
    const dataAdmissao = new Date(data);
    const hoje = new Date();
    return !isNaN(dataAdmissao) && dataAdmissao <= hoje;
};

// Valida se o salário é um número positivo
export const validarSalario = (salario) => {
    const salarioConvertido = Number(salario);
    return !isNaN(salarioConvertido) && salarioConvertido > 0;
};

// Valida se o CPF tem o formato correto
export const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, ''); // remove tudo que não for número

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false; // se tiver menos de 11 dígitos ou todos forem iguais
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

// Fomatação do cpf
export const formatarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
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

// Valida se o e-mail tem um formato válido
export const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Valida se o status é 1 ou 0
export const validarStatus = (status) => {
    const statusConvertido = Number(status);
    return statusConvertido === 1 || statusConvertido === 0;
};

// Valida se as senhas são iguais
export const validarSenhas = (senha, confmSenha) => {
    return senha === confmSenha;
};

// Valida se as novas senhas são iguais
export const validarNovasSenhas = (novaSenha, confmNovaSenha) => {
    return novaSenha === confmNovaSenha;
};

// Valida se as novas senhas redefinidas são iguais
export const validarSenhasRedefinidas = (novaSenha, confmNovaSenha) => {
    return novaSenha === confmNovaSenha;
};

// Valida se a senha tem no mínimo 6 caracteres, 1 maiúscula, 1 símbolo, sem acento e sem espaço
export const validarSenha = (senha) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{6,}$/;

    return (
        regex.test(senha)
    );
};
export const validarNovaSenha = (novaSenha) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{6,}$/;

    return (
        regex.test(novaSenha)
    );
};