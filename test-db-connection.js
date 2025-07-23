// Quick test to verify database connection works
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Testing database connection...');
  
  // Test MySQL connection (as configured in .env)
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'club_salvadoreno_db'
    });
    
    console.log('✅ MySQL connection successful');
    await connection.end();
  } catch (error) {
    console.log('❌ MySQL connection failed:', error.message);
    console.log('This is expected if MySQL is not running or configured');
  }
}

testConnection();
