// Script para agregar usuario a SQLite
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "data", "club_salvadoreno.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to SQLite database");
});

const userId = "13";
const now = new Date().toISOString();

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
  "Karla123456",
  "ghernandez@clubsalvadoreno.com",
  "+503 2345-6795",
  "atencion_miembro",
  1,
  "approved",
  "activo",
  "Contribuyente",
  now,
  now,
];

db.run(insertQuery, values, function (err) {
  if (err) {
    console.error("Error inserting user:", err);
  } else {
    console.log("✅ Usuario agregado exitosamente con ID:", this.lastID);
  }

  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
    } else {
      console.log("Database connection closed");
    }
  });
});
