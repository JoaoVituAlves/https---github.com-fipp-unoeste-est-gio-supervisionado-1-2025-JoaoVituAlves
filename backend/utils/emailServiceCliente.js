import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lucasyuiti2004@gmail.com',
    pass: 'lwdp szyb yohj lxjj',
  },
});

const enviarEmailRecuperacao = (email, token) => {
  const link = `http://localhost:3000/home/recuperacaoCliente/redefinirSenha?token=${token}`;
  const mailOptions = {
    from: '"Dumed Hospitalar" <dumed@dumedhospitalar.com.br>',
    to: email,
    subject: 'Redefinição de Senha',
    html: `
      <p>Você solicitou a redefinição da sua senha.</p>
      <p>Clique no link abaixo para criar uma nova senha:</p>
      <a href="${link}">${link}</a>
      <p>Se você não solicitou, apenas ignore este e-mail.</p>
    `
  };
  return transporter.sendMail(mailOptions);
};

export { enviarEmailRecuperacao };