---
company: "FPT Telecom"
role:
  en: "Software Engineer"
  vi: "Kỹ sư phần mềm"
period:
  start: "2023-01"
  end: null
stack:
  - Python
  - Django
  - FastAPI
  - Vue3
  - TailwindCSS
  - Langchain
  - ChromaDB
  - "Vertex AI"
  - GCP
  - Docker
order: 1
projects:
  - name: "GitLab Bot — AI Code Review"
    summary:
      en: "Automated AI code review across the org: MR summarization, SAST scanning, secret detection, and fix suggestions with full codebase impact analysis."
      vi: "Review code tự động bằng AI toàn tổ chức: tóm tắt MR, quét SAST, phát hiện secret và gợi ý sửa lỗi kèm phân tích tác động toàn mã nguồn."
    tech: [Python, Langchain, FastAPI, GitLab]
    metrics:
      - label: { en: "Repos automated", vi: "Repo tự động hóa" }
        value: 200
        suffix: "+"
        kind: count
      - label: { en: "MRs processed / month", vi: "MR xử lý / tháng" }
        value: 6000
        suffix: "/mo"
        kind: count
      - label: { en: "Security accuracy", vi: "Độ chính xác bảo mật" }
        value: 90
        suffix: "%+"
        kind: percent
      - label: { en: "General quality accuracy", vi: "Độ chính xác chất lượng" }
        value: 70
        suffix: "%"
        kind: percent
  - name: "Customer Service RAG Chatbot"
    summary:
      en: "RAG chatbot (dvkh247.fpt.net) on Vertex AI + ChromaDB + GCS for telecom package consultation, with context-aware answers from internal docs."
      vi: "Chatbot RAG (dvkh247.fpt.net) trên Vertex AI + ChromaDB + GCS tư vấn gói cước viễn thông, trả lời theo ngữ cảnh từ tài liệu nội bộ."
    tech: [Python, "Vertex AI", ChromaDB, Langchain, GCP]
    metrics:
      - label: { en: "Response accuracy", vi: "Độ chính xác phản hồi" }
        value: 75.5
        suffix: "%"
        kind: percent
  - name: "TechHub — Internal Knowledge Platform"
    summary:
      en: "Reddit-style social knowledge-sharing platform for FPT Telecom's technology division; UI/UX in Figma, full-stack Django + Vue3."
      vi: "Nền tảng chia sẻ kiến thức kiểu Reddit cho khối công nghệ FPT Telecom; UI/UX trên Figma, full-stack Django + Vue3."
    tech: [Django, Vue3, TailwindCSS]
    metrics:
      - label: { en: "Internal users", vi: "Người dùng nội bộ" }
        value: 5000
        suffix: "+"
        kind: count
  - name: "Enterprise Event Solutions"
    summary:
      en: "4-person team delivering full-stack conference apps end-to-end (UI/UX → backend → AI gamification) for FPT Telecom Strategic Conference 2022 & 2023."
      vi: "Đội 4 người xây dựng app hội nghị full-stack đầu-cuối (UI/UX → backend → gamification AI) cho Hội nghị Chiến lược FPT Telecom 2022 & 2023."
    tech: [Django, Vue3, Python]
    metrics:
      - label: { en: "Executives served", vi: "Lãnh đạo phục vụ" }
        value: 1000
        suffix: "+"
        kind: count
      - label: { en: "Delivery sprint", vi: "Sprint bàn giao" }
        value: 2
        suffix: "-week"
        kind: count
  - name: "Blacklist Bot — Real-Time Web Security"
    summary:
      en: "Near-real-time crawler ingesting government SOC threat feeds to instantly block malicious domains across FPT Telecom's network."
      vi: "Crawler gần thời gian thực thu nhận luồng cảnh báo SOC chính phủ để chặn tức thì các tên miền độc hại trên mạng FPT Telecom."
    tech: [Python, Selenium, BeautifulSoup]
---

## GitLab Bot — AI Code Review

Automated code review across **200+ repos**, processing up to **6,000 MRs/month**. Achieved **90%+ accuracy** on security issues and **70%** on general quality.

- MR summarization, SAST scanning, fix suggestions with full codebase impact analysis.
- Detects vulnerabilities, secrets, and anti-patterns; posts structured review comments per MR.

## Customer Service RAG Chatbot

RAG chatbot (`dvkh247.fpt.net`) built on **Vertex AI + ChromaDB + GCS**, achieving **75.5% response accuracy** for telecom package consultation at scale.

- GCP infrastructure: GCS for document storage, ChromaDB as vector store.
- Context-aware responses drawn from internal documentation corpus.

## Blacklist Bot — Real-Time Web Security

Near-real-time crawler ingesting government SOC threat feeds → instant domain blocking across FPT Telecom's network.

- BeautifulSoup + Selenium pipeline; enriched with [web-check](https://github.com/Lissy93/web-check) for threat intelligence.

## TechHub — Internal Knowledge Platform

Reddit-style social knowledge-sharing platform for FPT Telecom's technology division, now serving **5,000+ internal users**.

- UI/UX designed in Figma; full-stack delivered with Django + Vue3.

## Enterprise Event Solutions

4-person team delivered full-stack conference apps for **1,000+ executives** within **2-week sprints** (FPT Telecom Strategic Conference 2022 & 2023).

- End-to-end: UI/UX design → backend → AI gamification features for team competitions.
