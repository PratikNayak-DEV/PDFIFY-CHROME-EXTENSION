# Chrome Extension: Webpage to PDF Converter

This is a simple Chrome extension that allows users to convert web pages to PDF files. It supports converting the visible page or the full page and lets users customize settings like font size and layout.

## Features
- Convert the current web page to a PDF.
- Option to choose between visible content or the full page.
- Exclude unnecessary elements (like navbar, footer, ads) using CSS selectors.
- Customize settings via an options page.
- Store PDFs for later download.

## How It Works
1. Click the extension icon.
2. Choose options (visible page or full page conversion).
3. The content is cleaned (removing unwanted elements like navbars and footers).
4. The cleaned content is sent to the backend API for PDF conversion.
5. The generated PDF is returned and stored in `chrome.storage`.
6. The user can download the PDF file when ready.

## Tech Stack
- **Frontend:** JavaScript (Chrome Extension APIs)
- **Backend:** Node.js, Express.js (hosted on Vercel)
- **Storage:** `chrome.storage`
- **PDF API:** External online PDF conversion API

## Setup & Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/your-repo-name.git
   ```
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer Mode**.
4. Click **Load Unpacked** and select the extension folder.
5. The extension is now ready to use!

## Future Improvements
- Improve PDF layout customization.
- Support for offline PDF generation.
- Enhance CSS selector customization for better content filtering.

---

### Note
This extension is built for learning purposes. Free-tier hosting (Vercel) might have limitations if too many users start using it. If traffic increases, switching to a dedicated backend server may be required.

---

### Contributions & Issues
Feel free to open issues or contribute if you have ideas for improvements!

---

🚀 Built with passion & curiosity!

