<?php
include 'conexion.php';

$datos = json_decode(file_get_contents("php://input"), true);
$id = $datos['id'];
$colors = $datos['colors'];


$colores = implode(',', $colors);

$sql = "UPDATE nodos SET colores = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $colores, $id);
$stmt->execute();
$stmt->close();

$conn->close();

echo json_encode(['success' => true]);

