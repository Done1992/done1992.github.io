document.addEventListener("DOMContentLoaded", function () {
  // Beispielhafte Initialisierung
  const herstellerSelect = document.getElementById("hersteller");
  const cpuSelect = document.getElementById("cpu");
  const mainboardSelect = document.getElementById("mainboard");

  // JSON-Daten laden
  fetch("./artikel.json")
    .then(response => response.json())
    .then(data => {
      initHersteller(data);
      herstellerSelect.addEventListener("change", () => updateCPU(data));
      cpuSelect.addEventListener("change", () => updateMainboard(data));
    })
    .catch(error => {
      console.error("Fehler beim Laden der Daten:", error);
    });

  function initHersteller(data) {
    const hersteller = [...new Set(data.map(item => item.hersteller))];
    hersteller.forEach(h => {
      const opt = document.createElement("option");
      opt.value = h;
      opt.textContent = h;
      herstellerSelect.appendChild(opt);
    });
  }

  function updateCPU(data) {
    const selectedHersteller = herstellerSelect.value;
    cpuSelect.innerHTML = "<option>Bitte wählen</option>";
    const cpus = data.filter(item => item.typ === "cpu" && item.hersteller === selectedHersteller);
    cpus.forEach(cpu => {
      const opt = document.createElement("option");
      opt.value = cpu.name;
      opt.textContent = `${cpu.name} (${cpu.preis} €)`;
      opt.dataset.id = cpu.id;
      cpuSelect.appendChild(opt);
    });
    cpuSelect.disabled = cpus.length === 0;
  }

  function updateMainboard(data) {
    const selectedCPU = cpuSelect.value;
    mainboardSelect.innerHTML = "<option>Bitte wählen</option>";
    const mb = data.filter(item =>
      item.typ === "mainboard" &&
      item.kompatibel_mit.includes(selectedCPU)
    );
    mb.forEach(board => {
      const opt = document.createElement("option");
      opt.value = board.name;
      opt.textContent = `${board.name} (${board.preis} €)`;
      opt.dataset.id = board.id;
      mainboardSelect.appendChild(opt);
    });
    mainboardSelect.disabled = mb.length === 0;
  }
});
