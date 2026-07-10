<?php

$host = "localhost";
$dbname = "ezan_vakti_db";
$username = "root";
$password = "";

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["hata" => "Veritabanı bağlantı hatası"]);
    exit;
}
?>