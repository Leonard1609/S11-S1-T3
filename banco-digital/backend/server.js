const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const { usuario, password } = req.body;
  
  console.log("Intentando entrar con:", usuario);

  db.query("SELECT * FROM usuarios WHERE usuario = ?", [usuario], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error de conexión" });
    
    // Si no hay resultados, el arreglo está vacío
    if (result.length === 0) return res.status(401).json({ msg: "Usuario no existe" });

   
    const user = result[0]; 

    console.log("Password recibido:", password);
    console.log("Password en DB:", user.password);

    // Comparamos
    if (String(password) === String(user.password)) {
      const token = jwt.sign({ id: user.id, rol: user.rol }, "secreto123", { expiresIn: "1h" });
      console.log("¡Login exitoso para!", user.usuario);
      return res.json({ token, user });
    } else {
      console.log("Clave incorrecta para:", usuario);
      return res.status(401).json({ msg: "Clave incorrecta" });
    }
  });
});

// --- MIDDLEWARE DE VERIFICACIÓN ---
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ msg: "No token" }); 

  jwt.verify(token, "secreto123", (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Token inválido" });
    req.user = decoded;
    next();
  });
};

// --- OBTENER SALDO ---
app.get("/saldo", verifyToken, (req, res) => {
  db.query("SELECT saldo FROM usuarios WHERE id=?", [req.user.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result); 
  });
});

// --- TRANSFERENCIA ---
app.post("/transferir", verifyToken, (req, res) => {
  const { monto } = req.body; // Movido aquí arriba para que no dé error
  if (!monto || monto <= 0) return res.status(400).json({ msg: "Monto inválido" });
  
  const id = req.user.id;

  db.query("UPDATE usuarios SET saldo = saldo - ? WHERE id=?", [monto, id], (err) => {
    if (err) return res.status(500).json({ msg: "Error al actualizar saldo" });

    const queryHistorial = "INSERT INTO transacciones (usuario_id, tipo, monto) VALUES (?, 'Retiro', ?)";
    db.query(queryHistorial, [id, monto], (err) => {
      if (err) return res.status(500).json({ msg: "Error al guardar historial" });
      res.json({ msg: "Transferencia registrada con éxito" });
    });
  });
});

// --- HISTORIAL ---
app.get("/historial", verifyToken, (req, res) => {
  const query = "SELECT fecha, tipo, monto FROM transacciones WHERE usuario_id = ? ORDER BY fecha DESC";
  db.query(query, [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error en la base de datos" });
    res.json(result); 
  });
});

app.listen(3001, () => console.log("Servidor en puerto 3001"));