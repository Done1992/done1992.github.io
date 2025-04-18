
let artikel = {};
let auswahl = {};

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
  select.value = artikel.hersteller[0].name;
  select.dispatchEvent(new Event("change"));
}

function initCPUs() {
  const select = document.getElementById("cpu");
  select.innerHTML = "";
  const cpus = artikel.cpu.filter(cpu => cpu.hersteller === auswahl.hersteller);
  cpus.forEach(cpu => {
    const option = document.createElement("option");
    option.value = cpu.name;
    option.textContent = `${cpu.name} (${cpu.preis} €)`;
    option.setAttribute("data-sockel", cpu.sockel);
    option.setAttribute("data-ramTyp", cpu.ramTyp);
    option.setAttribute("data-preis", cpu.preis);
    select.appendChild(option);
  });
  select.addEventListener("change", () => {
    const cpu = cpus.find(c => c.name === select.value);
    auswahl.cpu = cpu;
    initMainboards(cpu.sockel, cpu.ramTyp);
  });
  select.value = cpus[0].name;
  select.dispatchEvent(new Event("change"));
}

function initMainboards(sockel, ramTyp) {
  const select = document.getElementById("mainboard");
  select.innerHTML = "";
  const boards = artikel.mainboard.filter(b => b.sockel === sockel && b.ramTyp === ramTyp);
  boards.forEach(board => {
    const option = document.createElement("option");
    option.value = board.name;
    option.textContent = `${board.name} (${board.preis} €)`;
    option.setAttribute("data-preis", board.preis);
    option.setAttribute("data-ramTyp", board.ramTyp);
    select.appendChild(option);
  });
  select.addEventListener("change", () => {
    const board = boards.find(b => b.name === select.value);
    auswahl.mainboard = board;
    initRAM(board.ramTyp);
  });
  select.value = boards[0].name;
  select.dispatchEvent(new Event("change"));
}

function initRAM(ramTyp) {
  const select = document.getElementById("ram");
  select.innerHTML = "";
  const rams = artikel.ram.filter(r => r.ramTyp === ramTyp);
  rams.forEach(ram => {
    const option = document.createElement("option");
    option.value = ram.name;
    option.textContent = `${ram.name} (${ram.preis} €)`;
    option.setAttribute("data-preis", ram.preis);
    select.appendChild(option);
  });
  select.addEventListener("change", berechneGesamtpreis);
  select.value = rams[0].name;
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
    select.value = artikel[feld][0].name;
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
