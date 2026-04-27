const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// --- LOGIN (Punto 3 de tu tarea) ---
app.post("/login", (req, res) => {
  const { usuario, password } = req.body;
  db.query("SELECT * FROM usuarios WHERE usuario=?", [usuario], (err, result) => {
    if (result.length === 0) return res.status(401).json({ msg: "Usuario no existe" });
    
    const user = result[0];
    if (password !== user.password) return res.status(401).json({ msg: "Clave incorrecta" }); 

    const token = jwt.sign({ id: user.id, rol: user.rol }, "secreto123", { expiresIn: "1h" }); 
    res.json({ token, user });
  });
});

// --- MIDDLEWARE DE SEGURIDAD (Punto 4) ---
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ msg: "No token" }); 

  jwt.verify(token, "secreto123", (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Token inválido" });
    req.user = decoded;
    next();
  });
};

// --- OBTENER SALDO (Punto 5) ---
app.get("/saldo", verifyToken, (req, res) => {
  db.query("SELECT saldo FROM usuarios WHERE id=?", [req.user.id], (err, result) => {
    res.json(result[0]); 
  });
});

// --- OBTENER HISTORIAL (Punto 6)--
app.get("/historial", verifyToken, (req, res) => {
    const query = "SELECT tipo, monto, fecha FROM transacciones WHERE usuario_id = ? ORDER BY fecha DESC";
    
    db.query(query, [req.user.id], (err, result) => {
      if (err) return res.status(500).json({ msg: "Error al obtener historial" });
      res.json(result);
    });
  });


app.listen(3001, () => console.log("Servidor corriendo en el puerto 3001"));