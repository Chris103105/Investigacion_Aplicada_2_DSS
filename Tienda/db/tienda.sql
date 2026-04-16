CREATE DATABASE IF NOT EXISTS tienda;
USE tienda;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    estado ENUM('disponible', 'no disponible') DEFAULT 'disponible'
);
