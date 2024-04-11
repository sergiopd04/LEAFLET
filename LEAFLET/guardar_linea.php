<?php
include 'conexion.php';

$datos = json_decode(file_get_contents("php://input"), true);
$coordenadas = $datos['coordenadas'];
$cantidadTrazadas = $datos['cantidadTrazadas']; 

$coordenadas_json = json_encode($coordenadas);

$primera_coordenada = reset($coordenadas);
$ultima_coordenada = end($coordenadas);

$sql = "INSERT INTO nodos (coordenadas, latitud_inicio, longitud_inicio, latitud_fin, longitud_fin, cantidad_trazadas) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sddddd", $coordenadas_json, $primera_coordenada['lat'], $primera_coordenada['lng'], $ultima_coordenada['lat'], $ultima_coordenada['lng'], $cantidadTrazadas);
$stmt->execute();
$stmt->close();

$conn->close();

echo json_encode(['success' => true]);
?>
