import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [vakitler, setVakitler] = useState(null);
  const [kalanSure, setKalanSure] = useState("");
  const [siradakiVakit, setSiradakiVakit] = useState("");

  useEffect(() => {
    fetch("http://localhost/ezan-vakti-uygulamasi/backend/ezan_vakti.php")
      .then((res) => res.json())
      .then((data) => {
        setVakitler(data[0]);
      });
  }, []);

useEffect(() => {
  if (!vakitler) return;

  const interval = setInterval(() => {
    const sonuc = siradakiVaktiBul(vakitler);
    setSiradakiVakit(sonuc.isim);
    setKalanSure(sonuc.kalan);
  }, 1000);

  return () => clearInterval(interval);
}, [vakitler]);

function siradakiVaktiBul(v) {
  const simdi = new Date();

  const liste = [
    { isim: "İmsak", saat: v.Imsak },
    { isim: "Güneş", saat: v.Gunes },
    { isim: "Öğle", saat: v.Ogle },
    { isim: "İkindi", saat: v.Ikindi },
    { isim: "Akşam", saat: v.Aksam },
    { isim: "Yatsı", saat: v.Yatsi },
  ];

  for (let item of liste) {
    const [saat, dakika] = item.saat.split(":");
    const vakit = new Date();
    vakit.setHours(saat, dakika, 0, 0);

    if (vakit > simdi) {
      return {
        isim: item.isim,
        kalan: sureHesapla(vakit - simdi),
      };
    }
  }

  return {
    isim: "Yarın İmsak",
    kalan: "Bugünkü vakitler bitti",
  };
}

function sureHesapla(ms) {
  const toplamSaniye = Math.floor(ms / 1000);
  const saat = String(Math.floor(toplamSaniye / 3600)).padStart(2, "0");
  const dakika = String(Math.floor((toplamSaniye % 3600) / 60)).padStart(2, "0");
  const saniye = String(toplamSaniye % 60).padStart(2, "0");

  return `${saat}:${dakika}:${saniye}`;
}

  if (!vakitler) return <h2>Yükleniyor...</h2>;

  return (
    <div className="container">
      <h1>🕌 Ezan Vakti Uygulaması</h1>
      <h2>İstanbul / Zeytinburnu</h2>
    

      <h3>Sıradaki Vakit: {siradakiVakit}</h3>
      <div className="timer">{kalanSure}</div>

      <div className="card">
        <p><span>İmsak</span><b>{vakitler.Imsak}</b></p>
        <p><span>Güneş</span><b>{vakitler.Gunes}</b></p>
        <p><span>Öğle</span><b>{vakitler.Ogle}</b></p>
        <p><span>İkindi</span><b>{vakitler.Ikindi}</b></p>
        <p><span>Akşam</span><b>{vakitler.Aksam}</b></p>
        <p><span>Yatsı</span><b>{vakitler.Yatsi}</b></p>
      </div>

      <p>{vakitler.MiladiTarihUzun}</p>
    </div>
  );
  
}

export default App;