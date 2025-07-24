#!/usr/bin/env node

/**
 * Script para verificar la configuración de MySQL y Email
 * Ejecutar con: node verify-config.js
 */

import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🔍 Verificando configuración del sistema...\n');

// Verificar configuración de MySQL
async function verifyMySQLConfig() {
  console.log('📊 Verificando MySQL...');
  
  try {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'club_salvadoreno_db'
    };

    console.log(`   Host: ${config.host}:${config.port}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   User: ${config.user}`);
    
    const connection = await mysql.createConnection(config);
    console.log('   ✅ Conexión exitosa');
    
    // Verificar si la base de datos existe
    const [databases] = await connection.execute('SHOW DATABASES LIKE ?', [config.database]);
    if (databases.length === 0) {
      console.log('   ⚠️  Base de datos no existe - será creada al inicializar');
    } else {
      console.log('   ✅ Base de datos existe');
    }
    
    // Verificar tablas
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`   📋 Tablas encontradas: ${tables.length}`);
    
    await connection.end();
    return true;
  } catch (error) {
    console.log('   ❌ Error de conexión:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   💡 Solución: Verificar que MySQL esté corriendo');
      console.log('      sudo systemctl start mysql');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('   💡 Solución: Verificar credenciales en .env');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('   💡 Solución: Crear la base de datos:');
      console.log(`      CREATE DATABASE ${process.env.DB_NAME || 'club_salvadoreno_db'};`);
    }
    
    return false;
  }
}

// Verificar configuración de Email
async function verifyEmailConfig() {
  console.log('\n📧 Verificando Email...');
  
  try {
    const config = {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: (parseInt(process.env.EMAIL_PORT) || 587) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    };

    console.log(`   Host: ${config.host}:${config.port}`);
    console.log(`   User: ${config.auth.user}`);
    console.log(`   Password: ${config.auth.pass ? '[SET]' : '[EMPTY]'}`);
    
    // Verificar que no sea un placeholder
    const placeholders = [
      'your-email-password-here',
      'REEMPLAZAR_CON_CONTRASEÑA_REAL',
      'development-password'
    ];
    
    if (!config.auth.pass || placeholders.includes(config.auth.pass)) {
      console.log('   ⚠️  Password es un placeholder - no se enviarán correos reales');
      console.log('   💡 Configura EMAIL_PASSWORD con tu contraseña real');
      return false;
    }
    
    const transporter = nodemailer.createTransport(config);
    
    // Verificar conexión
    const verified = await transporter.verify();
    if (verified) {
      console.log('   ✅ Configuración de email válida');
      console.log('   ✅ Servidor SMTP accesible');
      return true;
    }
    
  } catch (error) {
    console.log('   ❌ Error de configuración:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   💡 Solución: Verificar host y puerto SMTP');
    } else if (error.code === 'EAUTH') {
      console.log('   💡 Solución: Verificar credenciales de email');
      console.log('      Para Gmail: usar App Password en lugar de contraseña normal');
    }
    
    return false;
  }
}

// Ejecutar verificaciones
async function main() {
  console.log('🚀 Club Salvadoreño - Verificación de Configuración\n');
  
  // Mostrar configuración actual
  console.log('📋 Configuración actual:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   DB_TYPE: ${process.env.DB_TYPE}`);
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL}`);
  console.log('');
  
  const mysqlOk = await verifyMySQLConfig();
  const emailOk = await verifyEmailConfig();
  
  console.log('\n📊 Resumen:');
  console.log(`   MySQL: ${mysqlOk ? '✅ OK' : '❌ ERROR'}`);
  console.log(`   Email: ${emailOk ? '✅ OK' : '❌ ERROR'}`);
  
  if (mysqlOk && emailOk) {
    console.log('\n🎉 ¡Configuración completa! El sistema está listo para producción.');
  } else {
    console.log('\n⚠️  Revisa los errores anteriores antes de usar en producción.');
  }
}

main().catch(console.error);
