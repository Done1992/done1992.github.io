
function fetchData() {
  fetch('artikel.json')
    .then(response => response.json())
    .then(data => {
      window.artikel = data;
      initDropdowns();
    });
}

function initDropdowns() {
  const gruppen = ['hersteller','cpu','mainboard','ram','nvme','gehaeuse','netzteil','grafikkarte','luefter','wlan','os'];
  gruppen.forEach(gruppe => {
    const select = document.getElementById(gruppe);
    select.innerHTML = '';
    artikel[gruppe].forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.name;
      option.textContent = `${opt.name} (${opt.preis} €)`;
      option.setAttribute('data-preis', opt.preis);
      select.appendChild(option);
    });
    select.addEventListener('change', berechneGesamtpreis);
  });
  berechneGesamtpreis();
}

function berechneGesamtpreis() {
  let gesamt = 0;
  const selects = document.querySelectorAll('select');
  selects.forEach(s => {
    const preis = s.selectedOptions[0]?.getAttribute('data-preis');
    gesamt += preis ? parseFloat(preis) : 0;
  });
  document.getElementById('gesamtpreis').textContent = gesamt.toFixed(2);
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("PC-Konfiguration", 10, 10);
  let y = 20;
  const selects = document.querySelectorAll('select');
  selects.forEach(s => {
    const label = document.querySelector(`label[for=${s.id}]`).textContent;
    const value = s.value;
    doc.text(`${label}: ${value}`, 10, y);
    y += 10;
  });
  doc.text(`Gesamtpreis: ${document.getElementById('gesamtpreis').textContent} €`, 10, y);
  doc.save("konfiguration.pdf");
}

function saveConfig() {
  alert("Konfiguration gespeichert (Demo).");
}

function shareConfig() {
  const url = "https://done1992.github.io/produkte.html?share=demo123";
  const input = document.getElementById("shareUrl");
  input.value = url;
  input.style.display = "block";
  input.select();
  document.execCommand("copy");
  alert("Link kopiert: " + url);
}

document.addEventListener("DOMContentLoaded", fetchData);
