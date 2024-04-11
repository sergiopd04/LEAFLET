<?php
include 'conexion.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    
    $sql = "DELETE FROM nodos WHERE id = $id";
    
    if ($conn->query($sql) === TRUE) {
        
        http_response_code(200);
        echo json_encode(array("message" => "El registro fue eliminado correctamente."));
    } else {
        
        http_response_code(500);
        echo json_encode(array("message" => "Error al eliminar el registro: " . $conn->error));
    }
} else {
    
    echo json_encode(array("message" => "No se proporcionó un ID para eliminar."));
}


$conn->close();
?>