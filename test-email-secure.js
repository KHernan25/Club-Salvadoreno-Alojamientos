import dotenv from "dotenv";
dotenv.config();

console.log("🔍 TEST DE EMAIL - VERIFICACIÓN SEGURA");
console.log("=====================================");

console.log("\n📧 Configuración actual:");
console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST}`);
console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT}`);
console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM}`);

// Verificar contraseña sin mostrarla
const hasPassword =
  process.env.EMAIL_PASSWORD &&
  process.env.EMAIL_PASSWORD !== "your-email-password-here" &&
  process.env.EMAIL_PASSWORD !== "REEMPLAZAR_CON_CONTRASEÑA_REAL";

console.log(
  `EMAIL_PASSWORD: ${hasPassword ? "✅ CONFIGURADA" : "❌ NO CONFIGURADA"}`,
);

if (!hasPassword) {
  console.log("\n🚨 ACCIÓN REQUERIDA:");
  console.log("1. Edita el archivo .env");
  console.log(
    '2. Reemplaza "REEMPLAZAR_CON_CONTRASEÑA_REAL" con la contraseña real',
  );
  console.log("3. Guarda el archivo");
  console.log("4. Ejecuta este script nuevamente");
  process.exit(1);
}

console.log("\n🔧 Probando conexión SMTP...");

try {
  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.default.createTransporter({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  console.log("🔌 Verificando conexión...");
  await transporter.verify();
  console.log("✅ Conexión SMTP exitosa");

  console.log("\n📧 Enviando email de prueba...");
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER, // Enviar a uno mismo
    subject: "Test - Sistema de Email Club Salvadoreño",
    text: "Email de prueba enviado correctamente.",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">✅ Email funcionando correctamente</h2>
        <p>El sistema de email del Club Salvadoreño está configurado y funcionando.</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Host:</strong> ${process.env.EMAIL_HOST}</p>
        <p><strong>Puerto:</strong> ${process.env.EMAIL_PORT}</p>
      </div>
    `,
  });

  console.log("✅ Email de prueba enviado exitosamente");
  console.log(`📧 Message ID: ${info.messageId}`);
  console.log("\n🎉 CONFIGURACIÓN COMPLETA");
  console.log("El sistema de recuperación de contraseña ya puede funcionar.");
} catch (error) {
  console.log("❌ Error:", error.message);
  console.log("\n🔧 Posibles causas:");
  console.log("- Contraseña incorrecta");
  console.log("- Servidor SMTP no disponible");
  console.log("- Configuración de firewall");
  console.log("- Configuración del servidor de email");
}
