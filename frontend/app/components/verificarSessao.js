'use client'

import { useEffect } from 'react';
import httpClient from '../utils/httpClient';

export default function VerificarSessao() {
  useEffect(() => {
    httpClient.get("/auth/verificar-token")
      .then(async res => {
        if (res.status === 401 || res.status === 403) {
          // Token expirado ou inválido
          localStorage.removeItem("cliente");
          localStorage.removeItem("funcionario");
          window.location.href = "/home/login"; // ou rota de login
        }
      })
      .catch(() => {
        localStorage.removeItem("cliente");
        localStorage.removeItem("funcionario");
        window.location.href = "/home/login";
      });
  }, []);

  return null;
}