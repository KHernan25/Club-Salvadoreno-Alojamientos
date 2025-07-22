import dotenv from "dotenv";
dotenv.config();

console.log("🔍 DIAGNÓSTICO DE CONFIGURACIÓN DE EMAIL");
console.log("==========================================");

console.log("\n📧 Variables de entorno:");
console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST}`);
console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT}`);
console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
console.log(
  `EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? (process.env.EMAIL_PASSWORD === "your-email-password-here" ? "❌ PLACEHOLDER" : "✅ CONFIGURADA") : "❌ NO CONFIGURADA"}`,
);
console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM}`);

console.log("\n🚨 PROBLEMAS DETECTADOS:");

if (!process.env.EMAIL_HOST) {
  console.log("❌ EMAIL_HOST no está configurado");
}

if (!process.env.EMAIL_USER) {
  console.log("❌ EMAIL_USER no está configurado");
}

if (
  !process.env.EMAIL_PASSWORD ||
  process.env.EMAIL_PASSWORD === "your-email-password-here"
) {
  console.log("❌ EMAIL_PASSWORD no está configurado correctamente");
  console.log('   → Actualmente: "your-email-password-here" (placeholder)');
  console.log("   → Necesita: La contraseña real del email");
}

if (!process.env.EMAIL_FROM) {
  console.log("❌ EMAIL_FROM no está configurado");
}

console.log("\n💡 SOLUCIONES:");
console.log("1. Editar el archivo .env");
console.log("2. Cambiar EMAIL_PASSWORD por la contraseña real");
console.log('3. Si usas Gmail, necesitas una "App Password"');
console.log("4. Para otros proveedores, usar credenciales SMTP");

console.log("\n📝 EJEMPLO PARA GMAIL:");
console.log("EMAIL_HOST=smtp.gmail.com");
console.log("EMAIL_PORT=587");
console.log("EMAIL_USER=tu-email@gmail.com");
console.log("EMAIL_PASSWORD=tu-app-password-de-16-caracteres");
console.log('EMAIL_FROM="Club Salvadoreño <tu-email@gmail.com>"');

console.log("\n📝 EJEMPLO PARA OUTLOOK:");
console.log("EMAIL_HOST=smtp-mail.outlook.com");
console.log("EMAIL_PORT=587");
console.log("EMAIL_USER=tu-email@outlook.com");
console.log("EMAIL_PASSWORD=tu-contraseña");
console.log('EMAIL_FROM="Club Salvadoreño <tu-email@outlook.com>"');

console.log("\n🔧 TESTING CON NODEMAILER:");

if (
  process.env.EMAIL_PASSWORD &&
  process.env.EMAIL_PASSWORD !== "your-email-password-here"
) {
  console.log("✅ Intentando test de conexión...");

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

  try {
    await transporter.verify();
    console.log("✅ Conexión SMTP exitosa");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // Enviar a uno mismo para probar
      subject: "Test de configuración - Club Salvadoreño",
      text: "Este es un email de prueba para verificar que la configuración funciona correctamente.",
      html: `
        <h2>✅ Test exitoso</h2>
        <p>La configuración de email está funcionando correctamente.</p>
        <p><strong>Hora:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Host:</strong> ${process.env.EMAIL_HOST}</p>
        <p><strong>Usuario:</strong> ${process.env.EMAIL_USER}</p>
      `,
    });

    console.log("✅ Email de prueba enviado exitosamente");
    console.log(`📧 Message ID: ${info.messageId}`);
  } catch (error) {
    console.log("❌ Error en test de conexión:", error.message);
    console.log("\n🔧 Posibles soluciones:");
    console.log("- Verificar credenciales SMTP");
    console.log("- Verificar que el servidor permite conexiones externas");
    console.log('- Si usas Gmail, habilitar "App Passwords"');
    console.log("- Verificar firewall/proxy");
  }
} else {
  console.log("⏭️ Saltando test - configurar EMAIL_PASSWORD primero");
}
