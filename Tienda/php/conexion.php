<?php
$host = 'localhost';
$user = 'root'; 
$password = ''; 
$dbname = 'tienda';

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Error de conexión a la BD: " . $conn->connect_error]));
}
?>