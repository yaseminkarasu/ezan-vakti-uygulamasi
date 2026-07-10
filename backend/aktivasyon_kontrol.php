<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$kod = isset($_GET["kod"]) ? trim($_GET["kod"]) : "";

if ($kod === "") {
    echo json_encode([
        "gecerli" => false,
        "mesaj" => "Aktivasyon kodu gönderilmedi."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$sorgu = $db->prepare("
    SELECT id
    FROM aktivasyon_kodlari
    WHERE aktivasyon_kodu = ? AND aktif = 1
");

$sorgu->execute([$kod]);
$kayit = $sorgu->fetch(PDO::FETCH_ASSOC);

if ($kayit) {
    echo json_encode([
        "gecerli" => true,
        "mesaj" => "Aktivasyon kodu geçerli."
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        "gecerli" => false,
        "mesaj" => "Aktivasyon kodu geçersiz veya pasif."
    ], JSON_UNESCAPED_UNICODE);
}
?>