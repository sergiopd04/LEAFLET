<?php
include 'conexion.php';

$datos = json_decode(file_get_contents("php://input"), true);
$id = $datos['id'];
$text = $datos['text'];

$colores = trim($colors);

$sql = "UPDATE nodos SET text = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $text, $id);
$stmt->execute();
$stmt->close();

$conn->close();

echo json_encode(['success' => true]);