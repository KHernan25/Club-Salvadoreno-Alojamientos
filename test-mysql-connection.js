const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Probando conexión a MySQL...\n');

  try {
    // Test básico de conexión
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      timeout: 5000
    });

    console.log('✅ Conexión a MySQL exitosa');

    // Verificar si existe la base de datos
    const [databases] = await connection.query("SHOW DATABASES LIKE 'club_salvadoreno_db'");
    
    if (databases.length > 0) {
      console.log('✅ Base de datos "club_salvadoreno_db" existe');
      
      // Conectar a la base de datos específica
      await connection.query('USE club_salvadoreno_db');
      
      // Verificar tablas
      const [tables] = await connection.query('SHOW TABLES');
      console.log(`✅ Encontradas ${tables.length} tablas en la base de datos`);
      
      if (tables.length > 0) {
        console.log('📋 Tablas disponibles:');
        tables.forEach((table, index) => {
          console.log(`   ${index + 1}. ${Object.values(table)[0]}`);
        });

        // Verificar algunos datos
        try {
          const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
          console.log(`👥 Usuarios en la base de datos: ${users[0].count}`);
          
          const [accommodations] = await connection.query('SELECT COUNT(*) as count FROM accommodations');
          console.log(`🏠 Alojamientos en la base de datos: ${accommodations[0].count}`);
        } catch (err) {
          console.log('⚠️  No se pudieron consultar los datos:', err.message);
        }
      }
    } else {
      console.log('❌ Base de datos "club_salvadoreno_db" NO existe');
      console.log('💡 Ejecuta el script de configuración: node setup-database.js');
    }

    await connection.end();
    console.log('\n🎉 Test de conexión completado');

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n📋 Verifica que:');
    console.log('   1. MySQL está instalado y ejecutándose');
    console.log('   2. El usuario "root" tiene acceso sin contraseña');
    console.log('   3. MySQL está ejecutándose en localhost:3306');
    console.log('\n💡 Comandos útiles:');
    console.log('   - Iniciar MySQL: sudo service mysql start');
    console.log('   - Verificar estado: sudo service mysql status');
    console.log('   - Acceder a MySQL: mysql -u root -p');
  }
}

testConnection();
