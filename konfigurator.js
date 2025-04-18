
let artikel = {};
let auswahl = {
  hersteller: null,
  cpu: null,
  mainboard: null
};

document.addEventListener("DOMContentLoaded", () => {
  fetch("artikel.json")
    .then(res => res.json())
    .then(data => {
      artikel = data;
      initHersteller();
    });
});

function initHersteller() {
  const select = document.getElementById("hersteller");
  select.innerHTML = "";
  artikel.hersteller.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt.name;
    option.textContent = opt.name;
    select.appendChild(option);
  });
  select.addEventListener("change", () => {
    auswahl.hersteller = select.value;
    initCPUs();
  });
  select.dispatchEvent(new Event("change"));
}

function initCPUs() {
  const select = document.getElementById("cpu");
  select.innerHTML = "";
  artikel.cpu
    .filter(cpu => cpu.hersteller === auswahl.hersteller)
    .forEach(opt => {
      const option = document.createElement("option");
      option.value = opt.name;
      option.textContent = `${opt.name} (${opt.preis} €)`;
      option.setAttribute("data-preis", opt.preis);
      option.setAttribute("data-sockel", opt.sockel);
      option.setAttribute("data-ramTyp", opt.ramTyp);
      select.appendChild(option);
    });
  select.addEventListener("change", () => {
    const cpu = artikel.cpu.find(c => c.name === select.value);
    auswahl.cpu = cpu;
    initMainboards(cpu.sockel, cpu.ramTyp);
  });
  select.dispatchEvent(new Event("change"));
}

function initMainboards(sockel, ramTyp) {
  const select = document.getElementById("mainboard");
  select.innerHTML = "";
  artikel.mainboard
    .filter(board => board.sockel === sockel && board.ramTyp === ramTyp)
    .forEach(opt => {
      const option = document.createElement("option");
      option.value = opt.name;
      option.textContent = `${opt.name} (${opt.preis} €)`;
      option.setAttribute("data-preis", opt.preis);
      option.setAttribute("data-ramTyp", opt.ramTyp);
      select.appendChild(option);
    });
  select.addEventListener("change", () => {
    const board = artikel.mainboard.find(b => b.name === select.value);
    auswahl.mainboard = board;
    initRAM(board.ramTyp);
  });
  select.dispatchEvent(new Event("change"));
}

function initRAM(ramTyp) {
  const select = document.getElementById("ram");
  select.innerHTML = "";
  artikel.ram
    .filter(ram => ram.ramTyp === ramTyp)
    .forEach(opt => {
      const option = document.createElement("option");
      option.value = opt.name;
      option.textContent = `${opt.name} (${opt.preis} €)`;
      option.setAttribute("data-preis", opt.preis);
      select.appendChild(option);
    });
  select.addEventListener("change", berechneGesamtpreis);
  initWeitereFelder();
  berechneGesamtpreis();
}

function initWeitereFelder() {
  const felder = ["nvme", "gehaeuse", "netzteil", "grafikkarte", "luefter", "wlan", "os"];
  felder.forEach(feld => {
    const select = document.getElementById(feld);
    select.innerHTML = "";
    artikel[feld].forEach(opt => {
      const option = document.createElement("option");
      option.value = opt.name;
      option.textContent = `${opt.name} (${opt.preis} €)`;
      option.setAttribute("data-preis", opt.preis);
      select.appendChild(option);
    });
    select.addEventListener("change", berechneGesamtpreis);
  });
}

function berechneGesamtpreis() {
  let gesamt = 0;
  document.querySelectorAll("select").forEach(s => {
    const preis = s.selectedOptions[0]?.getAttribute("data-preis");
    if (preis) gesamt += parseFloat(preis);
  });
  document.getElementById("gesamtpreis").textContent = gesamt.toFixed(2);
}
