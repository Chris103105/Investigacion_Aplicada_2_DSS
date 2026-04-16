<?php
header('Content-Type: application/json');
require 'conexion.php';

$nombre = $_POST['nombre'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$precio = $_POST['precio'] ?? '';

if (empty($nombre) || empty($descripcion) || empty($precio)) {
    echo json_encode(["status" => "error", "message" => "Todos los campos son obligatorios."]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO productos (nombre, descripcion, precio) VALUES (?, ?, ?)");
$stmt->bind_param("ssd", $nombre, $descripcion, $precio);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Producto registrado exitosamente."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al registrar producto."]);
}

$stmt->close();
$conn->close();
?>