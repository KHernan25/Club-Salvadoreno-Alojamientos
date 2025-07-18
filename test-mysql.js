const mysql = require("mysql2/promise");

async function testConnection() {
  try {
    console.log("Testing MySQL connection...");
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      database: "club_salvadoreno_db",
    });

    console.log("✅ MySQL connection successful!");
    await connection.end();
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
    console.error("Code:", error.code);
    console.error("Error details:", error);
  }
}

testConnection();
