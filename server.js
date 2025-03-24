const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json()); // To parse JSON formatted data

// API to generate PDF from text (without saving to disk)
app.post("/api/generate-pdf", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required to generate PDF." });
  }

  // Set headers for PDF download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="generated.pdf"');

  // Create PDF and stream it directly to response
  const doc = new PDFDocument();
  doc.pipe(res);
  doc.text(text);
  doc.end();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
