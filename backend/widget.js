(function () {
  const script = document.currentScript;
  const aktivasyonKodu = script.getAttribute("data-key");
  const container = document.getElementById("ezan-widget");

  if (!container) {
    console.error("ezan-widget alanı bulunamadı.");
    return;
  }

  if (!aktivasyonKodu) {
    container.innerHTML = "Aktivasyon kodu bulunamadı.";
    return;
  }

  const kontrolUrl =
    "http://localhost/ezan-vakti-uygulamasi/backend/aktivasyon_kontrol.php?kod=" +
    encodeURIComponent(aktivasyonKodu);

  fetch(kontrolUrl)
    .then(response => response.json())
    .then(aktivasyon => {
      if (!aktivasyon.gecerli) {
        container.innerHTML = `
          <div style="padding:15px;color:#b00020;font-family:Arial;">
            Aktivasyon kodu geçersiz.
          </div>
        `;
        return;
      }

      ezanVakitleriniYukle();
    })
    .catch(error => {
      container.innerHTML = "Aktivasyon kontrolü yapılamadı.";
      console.error(error);
    });

  function ezanVakitleriniYukle() {
    fetch("http://localhost/ezan-vakti-uygulamasi/backend/ezan_vakti.php")
      .then(response => response.json())
      .then(data => {
        const vakitler = data[0];

        container.innerHTML = `
          <div style="
            width:320px;
            padding:20px;
            border-radius:15px;
            background:#102027;
            color:white;
            font-family:Arial;
            box-shadow:0 0 15px rgba(0,0,0,.3);
            text-align:center;
          ">
            <h2>\u{1F54C} Ezan Vakti</h2>
            <h3>\u0130stanbul / Zeytinburnu</h3>
            <h4 id="siradaki-vakit"></h4>

            <div id="ezan-sayac" style="
              font-size:34px;
              font-weight:bold;
              background:#1a1a1a;
              border-radius:12px;
              padding:10px;
              margin:15px 0;
            "></div>

            <div style="
              background:white;
              color:#111;
              border-radius:12px;
              padding:12px;
            ">
              <p>\u0130msak: <b>${vakitler.Imsak}</b></p>
              <p>G\u00FCne\u015F: <b>${vakitler.Gunes}</b></p>
              <p>\u00D6\u011Fle: <b>${vakitler.Ogle}</b></p>
              <p>\u0130kindi: <b>${vakitler.Ikindi}</b></p>
              <p>Ak\u015Fam: <b>${vakitler.Aksam}</b></p>
              <p>Yats\u0131: <b>${vakitler.Yatsi}</b></p>
            </div>

            <p style="font-size:13px;">
              ${vakitler.MiladiTarihUzun}
            </p>
          </div>
        `;

        sayaciGuncelle(vakitler);

        setInterval(() => {
          sayaciGuncelle(vakitler);
        }, 1000);
      })
      .catch(error => {
        container.innerHTML = "Ezan vakitleri yüklenemedi.";
        console.error(error);
      });
  }

  function sayaciGuncelle(vakitler) {
    const sonuc = siradakiVaktiBul(vakitler);

    document.getElementById("siradaki-vakit").innerText =
      "S\u0131radaki Vakit: " + sonuc.isim;

    document.getElementById("ezan-sayac").innerText = sonuc.kalan;
  }

  function siradakiVaktiBul(v) {
    const simdi = new Date();

    const liste = [
  { isim: "\u0130msak", saat: v.Imsak },
  { isim: "G\u00FCne\u015F", saat: v.Gunes },
  { isim: "\u00D6\u011Fle", saat: v.Ogle },
  { isim: "\u0130kindi", saat: v.Ikindi },
  { isim: "Ak\u015Fam", saat: v.Aksam },
  { isim: "Yats\u0131", saat: v.Yatsi }
];

    for (const item of liste) {
      const [saat, dakika] = item.saat.split(":");

      const vakit = new Date();
      vakit.setHours(Number(saat), Number(dakika), 0, 0);

      if (vakit > simdi) {
        return {
          isim: item.isim,
          kalan: sureHesapla(vakit - simdi)
        };
      }
    }

    return {
  isim: "Yar\u0131n \u0130msak",
  kalan: "Bug\u00FCnk\u00FC vakitler bitti"
  };
  }

  function sureHesapla(ms) {
    const toplamSaniye = Math.floor(ms / 1000);

    const saat = String(
      Math.floor(toplamSaniye / 3600)
    ).padStart(2, "0");

    const dakika = String(
      Math.floor((toplamSaniye % 3600) / 60)
    ).padStart(2, "0");

    const saniye = String(
      toplamSaniye % 60
    ).padStart(2, "0");

    return `${saat}:${dakika}:${saniye}`;
  }
})();