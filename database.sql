-- Ejecutar esto en la pestaña SQL de phpMyAdmin
CREATE DATABASE IF NOT EXISTS banco_db;
USE banco_db;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50),
  password VARCHAR(255),
  saldo DECIMAL(10,2),
  rol VARCHAR(20)
);

CREATE TABLE transacciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  tipo VARCHAR(20),
  monto DECIMAL(10,2),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (usuario, password, saldo, rol)
VALUES ('admin', '123', 5000, 'cliente');