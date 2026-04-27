const mysql = require("mysql2");
const db = mysql.createConnection({
host: "localhost",
user: "root", // Usuario por defecto de XAMPP
password: "", // Password vacío por defecto en XAMPP
database: "banco_db"
});
db.connect((err) => {
if (err) {
console.error("Error conectando a la base de datos:", err);
return;
}
console.log("Conectado exitosamente a MySQL en XAMPP");
});
module.exports = db;