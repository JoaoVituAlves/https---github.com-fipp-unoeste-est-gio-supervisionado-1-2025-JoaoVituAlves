'use client';

import { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const cliente = localStorage.getItem('cliente');
        const funcionario = localStorage.getItem('funcionario');

        if (funcionario && funcionario !== 'undefined') {
            try {
                setUser(JSON.parse(funcionario));
            } catch (error) {
                console.error("Erro ao fazer parse do funcionario:", error);
            }
        } else if (cliente && cliente !== 'undefined') {
            try {
                setUser(JSON.parse(cliente));
            } catch (error) {
                console.error("Erro ao fazer parse do cliente:", error);
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;