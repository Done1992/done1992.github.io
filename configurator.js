document.getElementById("pdfDownloadBtn").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("PC-Konfiguration", 105, y, { align: "center" });
  y += 10;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);

  let total = 0;
  const selections = document.querySelectorAll("select");
  selections.forEach(select => {
    const label = document.querySelector(`label[for='${select.id}']`);
    const name = label ? label.textContent : select.id;
    const value = select.options[select.selectedIndex].text;
    doc.text(`${name}: ${value}`, 10, y);
    y += 8;

    const priceAttr = select.options[select.selectedIndex].getAttribute("data-price");
    if (priceAttr) total += parseFloat(priceAttr);
  });

  y += 5;
  doc.setFont("Helvetica", "bold");
  doc.text(`Gesamtpreis: ${total.toFixed(2)} EUR`, 10, y);

  doc.save("pc-konfiguration.pdf");
});