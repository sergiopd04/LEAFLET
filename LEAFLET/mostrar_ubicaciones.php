<?php
include 'conexion.php';

$sql = "SELECT id, latitud, longitud FROM ubicaciones";
$result = $conn->query($sql);

$ubicaciones = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $ubicaciones[] = $row;
    }
} else {
    echo "0 resultados";
}


echo json_encode($ubicaciones);