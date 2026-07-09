<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$ilceKodu = "9541"; // Şimdilik örnek. Zeytinburnu kodunu bulunca değiştireceğiz.

$url = "https://ezanvakti.emushaf.net/vakitler/" . $ilceKodu;

$response = file_get_contents($url);

echo $response;

?>