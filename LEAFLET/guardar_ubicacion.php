<?php
include 'conexion.php';

$datos = json_decode(file_get_contents("php://input"), true);
$latitud = $datos['latlng']['lat'];
$longitud = $datos['latlng']['lng'];

$sql = "INSERT INTO ubicaciones (latitud, longitud) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("dd", $latitud, $longitud);
$stmt->execute();
$stmt->close();

$conn->close();

echo json_encode(['success' => true]);