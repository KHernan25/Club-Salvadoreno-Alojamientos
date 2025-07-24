const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function setupCompleteDatabase() {
  console.log('🚀 Iniciando configuración COMPLETA de base de datos MySQL...\n');

  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '', // Cambiar si tienes password
    multipleStatements: true
  });

  try {
    console.log('✅ Conectado a MySQL');

    // 1. Ejecutar script base de configuración
    console.log('📄 Ejecutando configuración base de la base de datos...');
    const baseScript = fs.readFileSync(path.join(__dirname, 'setup-mysql-database.sql'), 'utf8');
    await connection.query(baseScript);
    console.log('✅ Configuración base completada');

    // 2. Usar la base de datos
    await connection.query('USE club_salvadoreno_db');

    // 3. Verificar y actualizar contraseñas encriptadas
    console.log('🔐 Actualizando contraseñas con encriptación bcrypt...');
    
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);
    
    // Actualizar todas las contraseñas de los usuarios de ejemplo con hash real
    await connection.query(`
      UPDATE users 
      SET password = ? 
      WHERE id IN ('admin-001', 'user-001', 'user-002', 'user-003')
    `, [hashedPassword]);
    
    console.log('✅ Contraseñas encriptadas actualizadas');

    // 4. Ejecutar script de alojamientos reales
    console.log('🏠 Insertando alojamientos reales...');
    const accommodationsScript = fs.readFileSync(path.join(__dirname, 'real-accommodations-data.sql'), 'utf8');
    await connection.query(accommodationsScript);
    console.log('✅ Alojamientos reales insertados');

    // 5. Configuraciones adicionales para producción
    console.log('⚙️ Aplicando configuraciones adicionales...');
    
    // Configurar zona horaria
    await connection.query("SET time_zone = '-06:00'"); // Zona horaria de El Salvador

    // Configuraciones de sistema actualizadas
    await connection.query(`
      INSERT INTO system_config (id, config_key, config_value, description, is_public) VALUES
      ('conf-006', 'email_real_enabled', 'true', 'Emails reales habilitados', FALSE),
      ('conf-007', 'password_encryption', 'bcrypt', 'Tipo de encriptación de contraseñas', FALSE),
      ('conf-008', 'accommodations_count', '34', 'Total de alojamientos disponibles', TRUE),
      ('conf-009', 'corinto_houses', '6', 'Casas disponibles en Corinto', TRUE),
      ('conf-010', 'sunzal_suites', '16', 'Suites disponibles en El Sunzal', TRUE),
      ('conf-011', 'sunzal_houses', '6', 'Casas disponibles en El Sunzal', TRUE),
      ('conf-012', 'sunzal_apartments', '6', 'Apartamentos disponibles en El Sunzal', TRUE)
      ON DUPLICATE KEY UPDATE 
      config_value = VALUES(config_value),
      description = VALUES(description),
      is_public = VALUES(is_public)
    `);

    console.log('✅ Configuraciones adicionales aplicadas');

    // 6. Verificaciones finales
    console.log('\n📊 Verificando instalación...');

    // Verificar tablas
    const [tables] = await connection.query(`
      SELECT TABLE_NAME, TABLE_ROWS, CREATE_TIME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'club_salvadoreno_db'
      ORDER BY TABLE_NAME
    `);
    console.log(`✅ ${tables.length} tablas creadas correctamente`);

    // Verificar usuarios
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 ${users[0].count} usuarios creados`);

    // Verificar alojamientos por tipo y ubicación
    const [accommodations] = await connection.query(`
      SELECT 
        CASE 
          WHEN id LIKE 'corinto%' THEN 'Corinto'
          WHEN id LIKE 'sunzal%' THEN 'El Sunzal'
          ELSE 'Otros'
        END as ubicacion,
        type,
        COUNT(*) as cantidad
      FROM accommodations 
      GROUP BY 
        CASE 
          WHEN id LIKE 'corinto%' THEN 'Corinto'
          WHEN id LIKE 'sunzal%' THEN 'El Sunzal'
          ELSE 'Otros'
        END,
        type
      ORDER BY ubicacion, type
    `);

    console.log('\n🏠 Alojamientos por ubicación y tipo:');
    accommodations.forEach(acc => {
      console.log(`   ${acc.ubicacion} - ${acc.type}: ${acc.cantidad}`);
    });

    const [totalAccommodations] = await connection.query('SELECT COUNT(*) as total FROM accommodations');
    console.log(`\n✅ Total de alojamientos: ${totalAccommodations[0].total}`);

    // Verificar configuración del sistema
    const [configs] = await connection.query('SELECT COUNT(*) as count FROM system_config');
    console.log(`⚙️ ${configs[0].count} configuraciones del sistema`);

    console.log('\n🎉 ¡Base de datos configurada COMPLETAMENTE!');
    console.log('\n📋 Resumen de la instalación:');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│  CLUB SALVADOREÑO - BASE DE DATOS      │');
    console.log('├─────────────────────────────────────────┤');
    console.log('│  ✅ Base de datos: club_salvadoreno_db   │');
    console.log(`│  ✅ Tablas: ${tables.length.toString().padEnd(29)} │`);
    console.log(`│  ✅ Usuarios: ${users[0].count.toString().padEnd(27)} │`);
    console.log(`│  ✅ Alojamientos: ${totalAccommodations[0].total.toString().padEnd(23)} │`);
    console.log('│  ✅ Contraseñas: Encriptadas con bcrypt │');
    console.log('│  ✅ Emails: Configurados para reales   │');
    console.log('└─────────────────────────────────────────┘');

    console.log('\n👑 CREDENCIALES DE ACCESO:');
    console.log('┌────────────���────────────────────────────┐');
    console.log('│  SUPER ADMIN                            │');
    console.log('│  Usuario: admin                         │');
    console.log('│  Email: admin@clubsalvadoreno.com       │');
    console.log('│  Contraseña: admin123                   │');
    console.log('├─────────────────────────────────────────┤');
    console.log('│  ATENCIÓN AL MIEMBRO                    │');
    console.log('│  Usuario: ghernandez                    │');
    console.log('│  Email: ghernandez@clubsalvadoreno.com  │');
    console.log('│  Contraseña: admin123                   │');
    console.log('├─────────────────────────────────────────┤');
    console.log('│  ANFITRIÓN                              │');
    console.log('│  Usuario: mgarcia                       │');
    console.log('│  Email: mgarcia@clubsalvadoreno.com     │');
    console.log('│  Contraseña: admin123                   │');
    console.log('├────────────────────────────────���────────┤');
    console.log('│  MIEMBRO                                │');
    console.log('│  Usuario: crodriguez                    │');
    console.log('│  Email: crodriguez@clubsalvadoreno.com  │');
    console.log('│  Contraseña: admin123                   │');
    console.log('└─────────────────────────────────────────┘');

    console.log('\n🏠 ALOJAMIENTOS DISPONIBLES:');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│  CORINTO                                │');
    console.log('│  • 6 Casas frente al mar               │');
    console.log('│  • Desde $120 hasta $300 por noche     │');
    console.log('├─────────────────────────────────────────┤');
    console.log('│  EL SUNZAL                              │');
    console.log('│  • 16 Suites ($160 - $280/noche)       │');
    console.log('│  • 6 Casas ($320 - $500/noche)         │');
    console.log('│  • 6 Apartamentos ($100 - $220/noche)  │');
    console.log('└─────��───────────────────────────────────┘');

  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
    throw error;
  } finally {
    await connection.end();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Función para verificar prerrequisitos
async function checkPrerequisites() {
  try {
    // Verificar archivos necesarios
    const requiredFiles = [
      'setup-mysql-database.sql',
      'real-accommodations-data.sql'
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(path.join(__dirname, file))) {
        throw new Error(`Archivo requerido no encontrado: ${file}`);
      }
    }

    // Verificar conexión MySQL
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      timeout: 5000
    });
    
    await connection.ping();
    await connection.end();
    
    return true;
  } catch (error) {
    console.error('❌ Error en prerrequisitos:', error.message);
    return false;
  }
}

// Ejecutar configuración completa
async function main() {
  try {
    console.log('🔍 Verificando prerrequisitos...');
    
    const prereqsOk = await checkPrerequisites();
    
    if (!prereqsOk) {
      console.log('\n📋 Verificar que:');
      console.log('   1. MySQL está instalado y ejecutándose');
      console.log('   2. Los archivos setup-mysql-database.sql y real-accommodations-data.sql existen');
      console.log('   3. El usuario "root" tiene acceso sin contraseña');
      console.log('\n💡 Comandos útiles:');
      console.log('   - Iniciar MySQL: sudo service mysql start');
      console.log('   - Verificar estado: sudo service mysql status');
      process.exit(1);
    }

    await setupCompleteDatabase();
    
    console.log('\n🔗 CONFIGURACIÓN FINAL PARA LA APLICACIÓN:');
    console.log('   En tu archivo .env, asegurar:');
    console.log('   DATABASE_URL=mysql://root:@localhost:3306/club_salvadoreno_db');
    console.log('   DB_TYPE=mysql');
    console.log('   FORCE_REAL_API=true');
    console.log('   EMAIL_PASSWORD=tu_password_real_configurado');
    
    console.log('\n🚀 ¡La aplicación está lista para usar datos REALES!');
    
  } catch (error) {
    console.error('💥 Error durante la configuración completa:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { setupCompleteDatabase, checkPrerequisites };
