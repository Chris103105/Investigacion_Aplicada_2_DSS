<?php
header('Content-Type: application/json');
require 'conexion.php';

$result = $conn->query("SELECT * FROM productos ORDER BY id DESC");
$productos = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $productos]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al obtener los productos."]);
}

$conn->close();
?>