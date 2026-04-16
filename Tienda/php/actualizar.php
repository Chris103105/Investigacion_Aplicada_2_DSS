<?php
header('Content-Type: application/json');
require 'conexion.php';

$id = $_POST['id'] ?? '';
$precio = $_POST['precio'] ?? '';
$estado = $_POST['estado'] ?? '';

if (empty($id) || empty($precio) || empty($estado)) {
    echo json_encode(["status" => "error", "message" => "Faltan datos para actualizar."]);
    exit;
}

$stmt = $conn->prepare("UPDATE productos SET precio = ?, estado = ? WHERE id = ?");
$stmt->bind_param("dsi", $precio, $estado, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Producto actualizado exitosamente."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al actualizar producto."]);
}

$stmt->close();
$conn->close();
?>