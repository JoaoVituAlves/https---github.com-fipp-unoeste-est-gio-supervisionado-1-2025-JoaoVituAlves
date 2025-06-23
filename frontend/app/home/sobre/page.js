'use client';

import React from 'react';
import './sobre.css';

export default function SobreADumedHospitalar() {
  return (
    <div className="container-sobre">
      <h1 className="titulo-sobre">Sobre a Dumed Hospitalar</h1>

      {/* Seção 1: Quem Somos */}
      <section className="secao">
        <h2>Quem Somos</h2>
        <p>
          Atuando nos segmentos atacadista e varejista desde 2013, a Dumed Hospitalar é especializada em materiais hospitalares e correlatos, com todas as autorizações exigidas pelos órgãos reguladores.
        </p>
        <p>
          Nossa gama de atuação abrange medicamentos, materiais odontológicos e laboratoriais, saneantes, móveis e equipamentos hospitalares, artigos esportivos, cosméticos, EPIs, eletrodomésticos e muito mais.
        </p>
        <p>
          Nosso objetivo é oferecer atendimento ágil e eficiente com profissionais qualificados e experientes no atendimento a órgãos públicos e privados.
        </p>
      </section>

      <hr />

      {/* Seção 2: Missão */}
      <section className="secao">
        <h2>Missão</h2>
        <p>
          Garantir qualidade, segurança e eficiência na distribuição de produtos médicos e hospitalares, com foco no bem-estar dos pacientes e no suporte a profissionais da saúde.
        </p>
      </section>

      <hr />

      {/* Seção 3: Visão */}
      <section className="secao">
        <h2>Visão</h2>
        <p>
          Ser referência no mercado nacional como fornecedora confiável de soluções em saúde, reconhecida pela excelência no atendimento, inovação e compromisso com a vida.
        </p>
      </section>

      <hr />

      {/* Seção 4: Valores */}
      <section className="secao">
        <h2>Valores</h2>
        <ul>
          <li><strong>Qualidade:</strong> Compromisso com produtos certificados e eficientes.</li>
          <li><strong>Comprometimento:</strong> Foco total na satisfação de nossos clientes.</li>
          <li><strong>Ética:</strong> Respeito, responsabilidade e integridade em todas as relações.</li>
          <li><strong>Inovação:</strong> Busca contínua por soluções modernas e eficazes.</li>
          <li><strong>Agilidade:</strong> Processos organizados para entregas rápidas e seguras.</li>
        </ul>
      </section>

      <hr />

      {/* Seção 5: Nossa Trajetória */}
      <section className="secao">
        <h2>Nossa Trajetória</h2>
        <ul className="linha-do-tempo">
          <li><strong>2013:</strong> Fundação da Dumed Hospitalar, com foco em materiais hospitalares.</li>
          <li><strong>2016:</strong> Ampliação da linha com EPIs, cosméticos, móveis e eletros.</li>
          <li><strong>2019:</strong> Consolidação no atendimento a órgãos públicos e grandes instituições.</li>
          <li><strong>2025:</strong> Lançamento da plataforma digital para pedidos e vitrine de produtos.</li>
        </ul>
      </section>
    </div>
  );
}