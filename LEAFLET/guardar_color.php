<?php
include 'conexion.php';

$datos = json_decode(file_get_contents("php://input"), true);
$id = $datos['id'];
$colors = json_encode($datos['colors']); // Serializar el array de colores
$texto = $datos['texto'];

$colors = implode(',', $datos['colors']);


$sql = "UPDATE nodos SET colores = ?, texto = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $colors, $texto, $id); 
$stmt->execute();
$stmt->close();

$conn->close();

echo json_encode(['success' => true]);
?>
