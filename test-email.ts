import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailOptions = {
  from: process.env.EMAIL_FROM,
  to: 'jgarcia@clubsalvadoreno.com',
  subject: 'Correo de prueba - Club Salvadoreño',
  text: '¡Hola! Este es un correo de prueba.',
};

transporter.sendMail(mailOptions)
  .then(info => {
    console.log('✅ Correo enviado:', info.response);
  })
  .catch(error => {
    console.error('❌ Error al enviar correo:', error);
  });
