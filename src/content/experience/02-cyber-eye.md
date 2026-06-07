---
company: "Cyber Eye Technology"
role:
  en: "Software Engineer"
  vi: "Kỹ sư phần mềm"
period:
  start: "2020-06"
  end: "2023-01"
stack:
  - Python
  - "C#"
  - C++
  - OpenCV
  - PyTorch
  - Django
  - ReactJS
  - Docker
  - Nginx
order: 2
projects:
  - name: "AX-OCR — Vietnamese OCR Engine"
    summary:
      en: "Core team on AX, Vietnam's leading Vietnamese OCR engine. Led text segmentation + post-processing; offline C++ CPU-only inference for edge scanners and printers."
      vi: "Thành viên nòng cốt AX — engine OCR tiếng Việt hàng đầu Việt Nam. Phụ trách phân đoạn văn bản + hậu xử lý; suy luận C++ offline chỉ CPU cho máy scan và máy in."
    tech: [C++, OpenCV, PyTorch, Python]
    metrics:
      - label: { en: "Digit accuracy", vi: "Độ chính xác chữ số" }
        value: 98
        suffix: "%"
        kind: percent
      - label: { en: "Handwritten chars accuracy", vi: "Độ chính xác chữ viết tay" }
        value: 96
        suffix: "%"
        kind: percent
      - label: { en: "Handwritten dates accuracy", vi: "Độ chính xác ngày viết tay" }
        value: 97
        suffix: "%"
        kind: percent
      - label: { en: "PDF→DOCX formatting fidelity", vi: "Độ trung thực PDF→DOCX" }
        value: 80
        suffix: "%~"
        kind: percent
      - label: { en: "Industry award", vi: "Giải thưởng ngành" }
        kind: award
        text: { en: "Sao Khuê 2022 (VINASA)", vi: "Sao Khuê 2022 (VINASA)" }
  - name: "API Marketplace"
    summary:
      en: "RapidAPI-style intermediary letting sellers package and sell APIs; packaged AX OCR as a consumable API with trial and billing."
      vi: "Hệ thống trung gian kiểu RapidAPI cho phép đóng gói và bán API; đóng gói AX OCR thành API có dùng thử và thanh toán."
    tech: [Python, Django, ReactJS, Docker, Nginx]
  - name: "BID Statistics"
    summary:
      en: "Data pipeline crawling bidding data from the web, cleaning raw data into structured relational records, and importing into the database."
      vi: "Pipeline dữ liệu thu thập dữ liệu đấu thầu từ web, làm sạch thành dữ liệu quan hệ có cấu trúc và nạp vào cơ sở dữ liệu."
    tech: [Python, "C#", SQL, Selenium, BeautifulSoup]
---

## AX-OCR — Vietnamese OCR Engine

Core team on AX, Vietnam's leading Vietnamese OCR engine — winner of the **Sao Khuê Award 2022 (VINASA)**. Led text segmentation and post-processing pipeline.

- **98% accuracy** on digits · **96%** on handwritten chars, names, addresses · **97%** on handwritten dates.
- Offline C++ CPU-only inference for edge deployment on scanners and printers.
- PDF→DOCX converter maintaining **~80% formatting fidelity** on non-searchable scanned PDFs.
- Extracting structured fields from ID cards, resumes, insurance forms, and more.

## API Marketplace

RapidAPI-style intermediary system allowing sellers to register and package APIs for sale, and customers to purchase and trial them.

- Packaged AX OCR as a consumable API service with trial and billing system.
- Stack: Python · Django · ReactJS · Docker · Nginx.

## BID Statistics

Data pipeline crawling bidding data from the internet, cleaning raw data into structured relational data, and importing into the database.

- Stack: Python · C# · SQL · Selenium · BeautifulSoup.
