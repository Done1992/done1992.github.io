// configurator.js

document.addEventListener("DOMContentLoaded", function () {
  const herstellerSelect = document.getElementById("hersteller");
  const cpuSelect = document.getElementById("cpu");
  const mainboardSelect = document.getElementById("mainboard");
  const gehaeuseSelect = document.getElementById("gehaeuse");
  const netzteilSelect = document.getElementById("netzteil");
  const ramSelect = document.getElementById("ram");
  const nvmeSelect = document.getElementById("nvme");
  const gpuSelect = document.getElementById("gpu");
  const luefterSelect = document.getElementById("luefter");
  const osSelect = document.getElementById("os");
  const wlanSelect = document.getElementById("wlan");

  fetch("./artikel.json")
    .then((response) => response.json())
    .then((data) => {
      const artikel = data.artikel;
      initHersteller(artikel);
      herstellerSelect.addEventListener("change", () => updateCPU(artikel));
      cpuSelect.addEventListener("change", () => updateMainboard(artikel));

      setDefaultConfiguration(artikel);
    })
    .catch((error) => {
      console.error("Fehler beim Laden der Daten:", error);
    });

  function initHersteller(artikel) {
    const hersteller = [...new Set(artikel.map((item) => item.hersteller))];
    hersteller.forEach((h) => {
      const opt = document.createElement("option");
      opt.value = h;
      opt.textContent = h;
      herstellerSelect.appendChild(opt);
    });
  }

  function updateCPU(artikel) {
    const selectedHersteller = herstellerSelect.value;
    cpuSelect.innerHTML = "<option>Bitte wählen</option>";
    const cpus = artikel.filter(
      (item) => item.typ === "cpu" && item.hersteller === selectedHersteller
    );
    cpus.forEach((cpu) => {
      const opt = document.createElement("option");
      opt.value = cpu.name;
      opt.textContent = `${cpu.name} (${cpu.preis} €)`;
      cpuSelect.appendChild(opt);
    });
    cpuSelect.disabled = cpus.length === 0;
  }

  function updateMainboard(artikel) {
    const selectedCPU = cpuSelect.value;
    mainboardSelect.innerHTML = "<option>Bitte wählen</option>";
    const mbs = artikel.filter(
      (item) =>
        item.typ === "mainboard" &&
        item.kompatibel_mit &&
        item.kompatibel_mit.includes(selectedCPU)
    );
    mbs.forEach((board) => {
      const opt = document.createElement("option");
      opt.value = board.name;
      opt.textContent = `${board.name} (${board.preis} €)`;
      mainboardSelect.appendChild(opt);
    });
    mainboardSelect.disabled = mbs.length === 0;
  }

  function setDefaultConfiguration(artikel) {
    herstellerSelect.value = "Intel";
    updateCPU(artikel);

    setTimeout(() => {
      cpuSelect.value = "Intel Core i5-13600K";
      updateMainboard(artikel);

      setTimeout(() => {
        mainboardSelect.value = "ASUS ROG STRIX Z790-F";
      }, 100);
    }, 100);

    gehaeuseSelect.value = "be quiet! Pure Base 500DX";
    netzteilSelect.value = "Corsair RM750x 750W";
    ramSelect.value = "Corsair Vengeance DDR5 16GB";
    nvmeSelect.value = "Samsung 980 Pro 1TB";
    gpuSelect.value = "NVIDIA GeForce RTX 4070";
    luefterSelect.value = "Noctua NF-A12x25";
    osSelect.value = "Windows 11 Home";
    wlanSelect.value = "TP-Link Archer T6E PCIe WLAN";
  }
});
