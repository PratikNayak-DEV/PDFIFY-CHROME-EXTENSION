const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require('path');
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const PORT = process.env.PORT;


const app = express();

//Ratw Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
//
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(bodyParser.json());
//
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/api/generate-pdf", async (req, res) => {
    const { text } = req.body;
    
    try {
        let uuid = crypto.randomUUID();
        const filePath = path.join(__dirname, "pdfs", `${uuid}.pdf`);
        const writeStream = fs.createWriteStream(filePath);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment;filename=${uuid}.pdf`);
        const doc = new PDFDocument();
        doc.pipe(writeStream);
        doc.text(text);
        doc.end();


        writeStream.on("close", async () => {
            try {
                const fileContent = await fs.promises.readFile(filePath);
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", `attachment; filename=${uuid}.pdf`);
                res.send(fileContent);
            } catch (err) {
                console.error("Error reading PDF file:",err);
                res.status(500).send("Error generating PDF");
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error generating PDF");
    }
});

app.get("/", (req, res) => {
  fs.readdir(path.join(__dirname, "pdfs"), (err, files) => {
    if (err) {
      console.error("Error reading PDF directory:", err);
      return res.status(500).send("Error reading PDF directory");
    }
    res.render("allpdfs", { files });
  });
});

app.get("/pdfs/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "pdfs", filename);
  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      console.error("Error accessing PDF file:", err);
      return res.status(404).send("PDF not found");
    }
    res.sendFile(filePath);
  });
});

//
if (!fs.existsSync(path.join(__dirname, "pdfs"))) {
  fs.mkdirSync(path.join(__dirname, "pdfs"));
}


//
// Cleanup function for old PDFs
function cleanupOldPDFs() {
    const pdfsDir = path.join(__dirname, "pdfs");
    fs.readdir(pdfsDir, (err, files) => {
        if (err) return console.error('Cleanup error:', err);
        
        const now = Date.now();
        files.forEach(file => {
            const filePath = path.join(pdfsDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return console.error('File stat error:', err);
                
                // Delete files more than 1 hour
                if (now - stats.mtime.getTime() > 3600000) {
                    fs.unlink(filePath, err => {
                        if (err) console.error('Delete error:', err);
                    });
                }
            });
        });
    });
}

setInterval(cleanupOldPDFs, 3600000); // Run every hour

app.listen(PORT, () => {
    console.log(`Server starting on http://localhost:${PORT}`);
})