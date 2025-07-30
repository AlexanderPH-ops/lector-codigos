<?php
header('Content-Type: application/json; charset=UTF-8');
// Iniciar sesión
session_start();

$ajaxdata = $_POST['form_data'];

$_SESSION['ajaxdata'] = $ajaxdata;

echo json_encode($_SESSION['ajaxdata'] ?? [], JSON_PRETTY_PRINT);
/*if (isset($_SESSION['ajaxdata'])) {
    foreach ($_SESSION['ajaxdata'] as $key => $value) {
        echo "$key: " . (is_array($value) ? implode(", ", $value) : $value) . "<br>";
    }
}*/

?>