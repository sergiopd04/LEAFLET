<?php
include 'conexion.php';

$datos = json_decode(file_get_contents("php://input"), true);
$id = $datos['id'];
$colors = $datos['colors'];
$texto = $datos['texto'];


$colores = implode(',', $colors);

$sql = "UPDATE nodos SET colores = ?, texto = ?WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $colores, $texto, $id );
$stmt->execute();
$stmt->close();

$conn->close();

echo json_encode(['success' => true]);
?>
