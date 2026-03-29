import { jsPDF } from "jspdf";

/**
 * Generate and download a PDF receipt
 * @param {Object} data - Receipt data (title, citizen, amount, etc)
 */
export const downloadReceipt = (data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // ─── Header ───
  doc.setFillColor(10, 47, 90); // Navy
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("SUVIDHA KIOSK", 20, 20);

  doc.setFontSize(10);
  doc.text("SMART CITY PLATFORM · GOVT OF INDIA INITIATIVE", 20, 30);

  // ─── Receipt Title ───
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(18);
  doc.text(data.title || "OFFICIAL RECEIPT", 20, 60);

  // ─── Divider ───
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 65, pageWidth - 20, 65);

  // ─── Details ───
  doc.setFontSize(12);
  let y = 80;
  const lineH = 10;

  const addField = (label, value) => {
    if (!value) return;
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), 80, y);
    y += lineH;
  };

  addField("Date", new Date().toLocaleString());
  addField("Transaction ID", data.txnId || `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  addField("Citizen Name", data.citizenName);
  addField("Department", data.department);
  addField("Service", data.service);

  if (data.details) {
    Object.entries(data.details).forEach(([k, v]) => {
      addField(k, v);
    });
  }

  // ─── Amount ───
  y += 10;
  doc.setFillColor(245, 245, 245);
  doc.rect(20, y, pageWidth - 40, 20, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TOTAL AMOUNT PAID:", 30, y + 13);
  doc.text(data.amount || "₹0.00", pageWidth - 30, y + 13, { align: "right" });

  // ─── Footer ───
  y = doc.internal.pageSize.getHeight() - 30;
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("This is a computer-generated receipt and does not require a physical signature.", pageWidth / 2, y, { align: "center" });
  doc.text("Secured by NIC · Digital India", pageWidth / 2, y + 5, { align: "center" });

  // ─── Download ───
  const filename = `Suvidha_Receipt_${data.service || 'Common'}_${Date.now()}.pdf`;
  doc.save(filename);
};
