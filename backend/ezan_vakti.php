<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
require_once "db.php";

$il = "İstanbul";
$ilce = "Zeytinburnu";
$ilceKodu = "9541";
$bugun = date("Y-m-d");

/* 1) Önce veritabanında bugünün verisi var mı kontrol et */
$sorgu = $db->prepare("SELECT * FROM namaz_vakitleri WHERE ilce = ? AND tarih = ?");
$sorgu->execute([$ilce, $bugun]);
$kayit = $sorgu->fetch(PDO::FETCH_ASSOC);

if ($kayit) {
    echo json_encode([[
        "Imsak" => $kayit["imsak"],
        "Gunes" => $kayit["gunes"],
        "Ogle" => $kayit["ogle"],
        "Ikindi" => $kayit["ikindi"],
        "Aksam" => $kayit["aksam"],
        "Yatsi" => $kayit["yatsi"],
        "MiladiTarihUzun" => $kayit["miladi_tarih_uzun"]
    ]], JSON_UNESCAPED_UNICODE);
    exit;
}

/* 2) Veri yoksa API'den çek */
$url = "https://ezanvakti.emushaf.net/vakitler/" . $ilceKodu;
$response = file_get_contents($url);
$data = json_decode($response, true);

/* 3) API'den bugünün verisini bul */
$bugununVerisi = null;

foreach ($data as $item) {
    $apiTarih = date("Y-m-d", strtotime($item["MiladiTarihKisaIso8601"]));

    if ($apiTarih == $bugun) {
        $bugununVerisi = $item;
        break;
    }
}

if (!$bugununVerisi) {
    echo json_encode(["hata" => "Bugünün verisi bulunamadı"], JSON_UNESCAPED_UNICODE);
    exit;
}

/* 4) Bugünün verisini veritabanına kaydet */
$ekle = $db->prepare("
    INSERT INTO namaz_vakitleri 
    (il, ilce, tarih, imsak, gunes, ogle, ikindi, aksam, yatsi, miladi_tarih_uzun)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$ekle->execute([
    $il,
    $ilce,
    $bugun,
    $bugununVerisi["Imsak"],
    $bugununVerisi["Gunes"],
    $bugununVerisi["Ogle"],
    $bugununVerisi["Ikindi"],
    $bugununVerisi["Aksam"],
    $bugununVerisi["Yatsi"],
    $bugununVerisi["MiladiTarihUzun"]
]);

/* 5) React'e aynı formatta veri gönder */
echo json_encode([$bugununVerisi], JSON_UNESCAPED_UNICODE);

?>