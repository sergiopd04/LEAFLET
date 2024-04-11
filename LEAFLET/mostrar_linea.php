<?php
include 'conexion.php';

$sql = "SELECT * FROM nodos";
$result = $conn->query($sql);

$datos = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $id = $row['id'];
        $coordenadas = json_decode($row['coordenadas']);
        $cantidad_trazadas = $row['cantidad_trazadas'];
        $colores = explode(",", $row['colores']); 
        
        if ($coordenadas) {
            $datos[] = array('id' => $id, 'coordenadas' => $coordenadas, 'cantidad_trazadas' => $cantidad_trazadas, 'colores' => $colores);
        }
    }
}

echo json_encode($datos);
?>
