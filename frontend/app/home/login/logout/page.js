'use client'

import Loading from "../../../components/loading";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import httpClient from "../../../utils/httpClient"; 
import UserContext from "../../../context/userContext";
import { useContext } from "react";

export default function Logout() {
    const router = useRouter();

    const {setUser} = useContext(UserContext);

    useEffect(() => {
        async function deslogar() {
            try {
                await httpClient.get('/auth/logout');
                localStorage.removeItem('funcionario');
                localStorage.removeItem('cliente');
                setUser(null);
            } catch (e) {
                console.error("Erro ao deslogar:", e);
            } finally {
                router.push('/home/login');
            }
        }

        deslogar();
    }, [router]);

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center'}}>
            <Loading />
            <h2>Estamos deslogando o seu usuário</h2>
        </div>
    );
}
