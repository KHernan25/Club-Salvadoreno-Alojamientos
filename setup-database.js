const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🚀 Iniciando configuración de base de datos MySQL...\n');

  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '', // Cambiar si tienes password
    multipleStatements: true
  });

  try {
    console.log('✅ Conectado a MySQL');

    // Leer y ejecutar el script de configuración
    const sqlScript = fs.readFileSync(path.join(__dirname, 'setup-mysql-database.sql'), 'utf8');
    
    console.log('📄 Ejecutando script de configuración...');
    await connection.query(sqlScript);
    
    console.log('✅ Script ejecutado correctamente');

    // Verificar que las tablas se crearon
    const [tables] = await connection.query(`
      SELECT TABLE_NAME, TABLE_ROWS, CREATE_TIME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'club_salvadoreno_db'
      ORDER BY TABLE_NAME
    `);

    console.log('\n📊 Tablas creadas en la base de datos:');
    console.table(tables);

    // Verificar usuarios creados
    await connection.query('USE club_salvadoreno_db');
    const [users] = await connection.query('SELECT id, username, email, role, status FROM users');
    
    console.log('\n👥 Usuarios iniciales creados:');
    console.table(users);

    // Verificar alojamientos
    const [accommodations] = await connection.query('SELECT id, name, type, capacity, price_per_night FROM accommodations');
    
    console.log('\n🏠 Alojamientos de ejemplo:');
    console.table(accommodations);

    console.log('\n🎉 ¡Base de datos configurada correctamente!');
    console.log('\n📋 Credenciales de acceso:');
    console.log('👑 Super Admin:');
    console.log('   Usuario: admin');
    console.log('   Email: admin@clubsalvadoreno.com');
    console.log('   Contraseña: admin123');
    console.log('\n👨‍💼 Atención al Miembro:');
    console.log('   Usuario: ghernandez');
    console.log('   Email: ghernandez@clubsalvadoreno.com');
    console.log('   Contraseña: admin123');
    console.log('\n🏠 Anfitrión:');
    console.log('   Usuario: mgarcia');
    console.log('   Email: mgarcia@clubsalvadoreno.com');
    console.log('   Contraseña: admin123');
    console.log('\n👤 Miembro:');
    console.log('   Usuario: crodriguez');
    console.log('   Email: crodriguez@clubsalvadoreno.com');
    console.log('   Contraseña: admin123');

  } catch (error) {
    console.error('❌ Error al configurar la base de datos:', error);
    throw error;
  } finally {
    await connection.end();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Función para verificar si MySQL está disponible
async function checkMySQLConnection() {
  try {
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
    return false;
  }
}

// Ejecutar el setup
async function main() {
  try {
    console.log('🔍 Verificando conexión a MySQL...');
    
    const isConnected = await checkMySQLConnection();
    
    if (!isConnected) {
      console.log('❌ No se puede conectar a MySQL');
      console.log('📋 Por favor verifica que:');
      console.log('   1. MySQL está instalado y ejecutándose');
      console.log('   2. El usuario "root" tiene acceso sin contraseña');
      console.log('   3. MySQL está ejecutándose en localhost:3306');
      console.log('\n💡 Comandos útiles:');
      console.log('   - Iniciar MySQL: sudo service mysql start');
      console.log('   - Verificar estado: sudo service mysql status');
      console.log('   - Acceder a MySQL: mysql -u root -p');
      process.exit(1);
    }

    await setupDatabase();
    
    console.log('\n🔗 Para conectar tu aplicación:');
    console.log('   DATABASE_URL=mysql://root:@localhost:3306/club_salvadoreno_db');
    console.log('   DB_TYPE=mysql');
    console.log('   FORCE_REAL_API=true');
    
  } catch (error) {
    console.error('💥 Error durante la configuración:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { setupDatabase, checkMySQLConnection };
