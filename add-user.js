// Script temporal para agregar usuario ghernandez@clubsalvadoreno.com
const mysql = require("mysql2/promise");

async function addUser() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      database: "club_salvadoreno_db",
    });

    console.log("Conectado a MySQL...");

    const userId = "13";
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const insertQuery = `
      INSERT INTO users (
        id, first_name, last_name, username, password, email, phone, role, 
        is_active, status, member_status, membership_type, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId,
      "Karla",
      "Hernández",
      "khernandez",
      "Karla123456", // En producción debería estar hasheada
      "ghernandez@clubsalvadoreno.com",
      "+503 2345-6795",
      "atencion_miembro",
      1, // is_active
      "approved",
      "activo",
      "Contribuyente",
      now,
      now,
    ];

    const result = await connection.execute(insertQuery, values);
    console.log("✅ Usuario agregado exitosamente:", result);

    await connection.end();
    console.log("✅ Conexión cerrada");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

addUser();
