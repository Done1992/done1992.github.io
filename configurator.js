document.addEventListener("DOMContentLoaded", function () {
  const herstellerSelect = document.getElementById("hersteller");
  const cpuSelect = document.getElementById("cpu");
  const mainboardSelect = document.getElementById("mainboard");

  // JSON-Daten laden
  fetch("./artikel.json")
    .then(response => response.json())
    .then(data => {
      const artikel = data.artikel; // WICHTIG: Array aus dem JSON extrahieren
      initHersteller(artikel);
      herstellerSelect.addEventListener("change", () => updateCPU(artikel));
      cpuSelect.addEventListener("change", () => updateMainboard(artikel));
    })
    .catch(error => {
      console.error("Fehler beim Laden der Daten:", error);
    });

  function initHersteller(artikel) {
    const hersteller = [...new Set(artikel.map(item => item.hersteller))];
    hersteller.forEach(h => {
      const opt = document.createElement("option");
      opt.value = h;
      opt.textContent = h;
      herstellerSelect.appendChild(opt);
    });
  }

  function updateCPU(artikel) {
    const selectedHersteller = herstellerSelect.value;
    cpuSelect.innerHTML = "<option>Bitte wählen</option>";
    const cpus = artikel.filter(item => item.typ === "cpu" && item.hersteller === selectedHersteller);
    cpus.forEach(cpu => {
      const opt = document.createElement("option");
      opt.value = cpu.name;
      opt.textContent = `${cpu.name} (${cpu.preis} €)`;
      opt.dataset.id = cpu.id;
      cpuSelect.appendChild(opt);
    });
    cpuSelect.disabled = cpus.length === 0;
  }

  function updateMainboard(artikel) {
    const selectedCPU = cpuSelect.value;
    mainboardSelect.innerHTML = "<option>Bitte wählen</option>";
    const mbs = artikel.filter(item =>
      item.typ === "mainboard" &&
      item.kompatibel_mit &&
      item.kompatibel_mit.includes(selectedCPU)
    );
    mbs.forEach(board => {
      const opt = document.createElement("option");
      opt.value = board.name;
      opt.textContent = `${board.name} (${board.preis} €)`;
      opt.dataset.id = board.id;
      mainboardSelect.appendChild(opt);
    });
    mainboardSelect.disabled = mbs.length === 0;
  }
});
