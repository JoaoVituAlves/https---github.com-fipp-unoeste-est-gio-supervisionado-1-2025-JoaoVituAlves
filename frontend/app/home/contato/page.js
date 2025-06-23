'use client';

import React, { useState } from 'react';
import { MailIcon, PhoneCallIcon, MapPinIcon, SendIcon, InfoIcon } from 'lucide-react';
import emailjs from '@emailjs/browser';
import './Contato.css';

emailjs.init({ publicKey: 'zbGQQXUtp3SZV-Ta8' });

function Contato() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const formatPhoneNumber = value => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 2) return numbers;

    const ddd = numbers.slice(0, 2);
    const main = numbers.slice(2);

    if (main.length <= 4) {
      return `(${ddd}) ${main}`;
    }

    // Celular (11 dígitos e começa com 9)
    if (numbers.length >= 11 && main[0] === '9') {
      return `(${ddd}) ${main.slice(0, 5)}-${main.slice(5, 9)}`;
    }

    // Fixo (10 dígitos)
    return `(${ddd}) ${main.slice(0, 4)}-${main.slice(4, 8)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      return setValidationErrors({ ...validationErrors, email: 'Email inválido' });
    }

    const phoneNumbers = formData.phone.replace(/\D/g, '');
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      return setValidationErrors({ ...validationErrors, phone: 'Telefone inválido' });
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      await emailjs.send('service_hwl9vll', 'template_eqztfpk', {
        to_email: 'dumedhospitalar@hotmail.com',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      setSubmitStatus('Mensagem enviada com sucesso!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setValidationErrors({});
    } catch (error) {
      console.error('Erro:', error);
      setSubmitStatus('Erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const updatedValue = id === 'phone' ? formatPhoneNumber(value) : value;

    setFormData(prev => ({ ...prev, [id]: updatedValue }));
    if (validationErrors[id]) {
      setValidationErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  return (
    
    <div className="container">
      <div className="header">
        <br/>
        <h1>Fale Conosco</h1>
        <p>Preencha o formulário ou entre em contato pelos canais abaixo.</p>
      </div>

      <div className="grid">
        <div className="contact-list">
          {[
            {
              icon: <MapPinIcon className="w-6 h-6 text-blue-600" />,
              title: 'Endereço',
              text: 'Rua Emílio Trevisan, 400\nBairro: Jardim Bela Dária\nPresidente Prudente - SP, 19013-200',
            },
            {
              icon: <PhoneCallIcon className="w-6 h-6 text-blue-600" />,
              title: 'Telefone',
              text: '(18) 3222-0827 - Telefone Fixo\n(18) 99691-0166 - Eduardo Dalefi ',
            },
            {
              icon: <MailIcon className="w-6 h-6 text-blue-600" />,
              title: 'E-mail',
              text: 'dumed@dumedhospitalar.com.br\nvgsequipamentos@hotmail.com',
            },
            {
              icon: <InfoIcon className="w-6 h-6 text-blue-600" />,
              title: 'Informações',
              text: 'Razão Social: Dumed Hospitalar LTDA\nCNPJ: 19.266.516/0001-00\nIE: 562.330.861.119',
            },
          ].map(({ icon, title, text }, index) => (
            <div key={index} className="contact-card">
              <div className="icon-wrapper">{icon}</div>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            {[
              { id: 'name', label: 'Nome', example: 'Ex: João da Silva' },
              { id: 'email', label: 'Email', example: 'Ex: fulano@email.com' },
              { id: 'phone', label: 'Telefone', example: '(00) 00000-0000 ou (00) 0000-0000' },
              { id: 'subject', label: 'Assunto', example: 'Ex: Pedido de orçamento' },
            ].map(({ id, label, example }) => (
              <div key={id} className="form-group">
                <label htmlFor={id}>{label}</label>
                <input
                  id={id}
                  type={id === 'email' ? 'email' : 'text'}
                  value={formData[id]}
                  onChange={handleChange}
                  placeholder={example}
                  maxLength={id === 'phone' ? 15 : 50}
                  disabled={isSubmitting}
                  required
                  className={validationErrors[id] ? 'error-input' : ''}
                />
                {validationErrors[id] && (
                  <p className="error">{validationErrors[id]}</p>
                )}
              </div>
            ))}

            <div className="form-group">
              <label htmlFor="message">Mensagem</label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder='Digite aqui...'
                maxLength={1000}
              />
              <small className={formData.message.length === 1000 ? 'text-danger' : 'text-success'}>
                {formData.message.length}/1000 caracteres
              </small>
            </div>

            {submitStatus && (
              <div className={`status ${submitStatus.includes('sucesso') ? 'success' : 'error'}`}>
                {submitStatus}
              </div>
            )}

            <button type="submit" disabled={isSubmitting}>
              <SendIcon className="w-4 h-4" />
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contato;