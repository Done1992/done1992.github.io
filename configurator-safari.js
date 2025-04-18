alert("JS geladen!");
// configurator.js – Safari-kompatibel mit statischem jsPDF-Import

const komponenten = ["prozessorHersteller", "cpu", "mainboard", "ram", "nvme", "lüfter", "gehäuse", "netzteil", "grafikkarte", "wlan", "betriebssystem"];
let daten = {};
let auswahl = {};
let preise = {};

async function ladeDaten() {
  const res = await fetch('./artikel.json');
  daten = await res.json();
  baueDropdowns();
  ladeVonUrl();
}

function baueDropdowns() {
  const container = document.getElementById("konfigurator-container");
  komponenten.forEach(name => {
    const gruppe = daten[name] || [];
    const wrapper = document.createElement("div");

    const label = document.createElement("label");
    label.textContent = name.charAt(0).toUpperCase() + name.slice(1) + ":";
    const select = document.createElement("select");
    select.id = name;
    gruppe.forEach((item, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${item.name} (+${item.preis} €)`;
      select.appendChild(opt);
    });
    select.selectedIndex = gruppe.findIndex(i => i.standard === true || i.name.includes("16GB") || i.name.includes("1TB")) || 0;
    auswahl[name] = gruppe[select.selectedIndex].name;
    preise[name] = gruppe[select.selectedIndex].preis;

    select.addEventListener("change", () => {
      const gewählt = gruppe[select.value];
      auswahl[name] = gewählt.name;
      preise[name] = gewählt.preis;
      updateGesamtpreis();
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    container.appendChild(wrapper);
  });

  updateGesamtpreis();
}

function updateGesamtpreis() {
  const gesamt = Object.values(preise).reduce((sum, p) => sum + p, 0);
  let preisEl = document.getElementById("gesamtpreis");
  if (!preisEl) {
    preisEl = document.createElement("p");
    preisEl.id = "gesamtpreis";
    document.getElementById("konfigurator-container").appendChild(preisEl);
  }
  preisEl.textContent = `Gesamtpreis: ${gesamt} €`;
}

document.getElementById("saveBtn").addEventListener("click", () => {
  localStorage.setItem("pc_konfiguration", JSON.stringify({ auswahl, preise }));
  alert("Konfiguration gespeichert!");
});

document.getElementById("shareBtn").addEventListener("click", () => {
  const encoded = btoa(JSON.stringify({ auswahl, preise }));
  const url = `${window.location.origin}${window.location.pathname}?config=${encoded}`;
  const input = document.getElementById("shareUrl");
  input.value = url;
  input.style.display = "block";
  input.select();
  document.execCommand("copy");
  alert("Link kopiert!");
});

function ladeVonUrl() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("config");
  if (!encoded) return;

  try {
    const decoded = JSON.parse(atob(encoded));
    auswahl = decoded.auswahl || {};
    preise = decoded.preise || {};

    komponenten.forEach(k => {
      const select = document.getElementById(k);
      const gruppe = daten[k];
      const idx = gruppe.findIndex(i => i.name === auswahl[k]);
      if (idx >= 0) {
        select.selectedIndex = idx;
      }
    });

    updateGesamtpreis();
  } catch (e) {
    console.warn("Ungültige Konfiguration in URL");
  }
}

document.getElementById("downloadPdfBtn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("PC-Konfiguration", 10, 10);
  let y = 20;
  komponenten.forEach(k => {
    doc.text(`${k}: ${auswahl[k]} (${preise[k]} €)`, 10, y);
    y += 10;
  });
  doc.text(`Gesamt: ${Object.values(preise).reduce((a, b) => a + b, 0)} €`, 10, y + 10);
  doc.save("pc-konfiguration.pdf");
});

ladeDaten();
