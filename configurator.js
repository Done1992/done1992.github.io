document.addEventListener("DOMContentLoaded", () => {
    fetch("artikel.json")
        .then(response => response.json())
        .then(data => {
            const herstellerSelect = document.getElementById("hersteller");
            const cpuSelect = document.getElementById("cpu");
            const mainboardSelect = document.getElementById("mainboard");
            const ramSelect = document.getElementById("ram");
            const nvmeSelect = document.getElementById("nvme");
            const grafikkarteSelect = document.getElementById("grafikkarte");

            const kategorien = {
                hersteller: new Set(),
                cpu: [],
                mainboard: [],
                ram: [],
                nvme: [],
                grafikkarte: []
            };

            data.forEach(artikel => {
                if (artikel.kategorie === "hersteller") {
                    kategorien.hersteller.add(artikel.name);
                } else if (kategorien[artikel.kategorie]) {
                    kategorien[artikel.kategorie].push(artikel);
                }
            });

            kategorien.hersteller.forEach(h => {
                herstellerSelect.innerHTML += `<option value="${h}">${h}</option>`;
            });

            herstellerSelect.addEventListener("change", () => {
                const selected = herstellerSelect.value;
                cpuSelect.innerHTML = "<option value=''>Bitte wählen</option>";
                kategorien.cpu
                    .filter(cpu => cpu.hersteller === selected)
                    .forEach(cpu => {
                        cpuSelect.innerHTML += `<option value="${cpu.name}">${cpu.name}</option>`;
                    });
            });

            cpuSelect.addEventListener("change", () => {
                const selectedCPU = cpuSelect.value;
                mainboardSelect.innerHTML = "<option value=''>Bitte wählen</option>";
                const cpuData = kategorien.cpu.find(cpu => cpu.name === selectedCPU);
                if (cpuData) {
                    kategorien.mainboard
                        .filter(board => board.kompatibel_mit.includes(cpuData.socket))
                        .forEach(board => {
                            mainboardSelect.innerHTML += `<option value="${board.name}">${board.name}</option>`;
                        });
                }
            });

            ["ram", "nvme", "grafikkarte"].forEach(kat => {
                const select = document.getElementById(kat);
                kategorien[kat].forEach(item => {
                    select.innerHTML += `<option value="${item.name}">${item.name}</option>`;
                });
            });
        })
        .catch(err => console.error("Fehler beim Laden der Daten:", err));
});
