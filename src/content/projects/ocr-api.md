---
title: "OCR API"
summary:
  en: "Personal Vietnamese OCR API service wrapping battle-tested OCR pipelines from AX-OCR experience into a clean REST interface."
  vi: "Dịch vụ API OCR tiếng Việt cá nhân, đóng gói pipeline OCR từ kinh nghiệm AX-OCR thành REST interface gọn gàng."
cover: /covers/ocr-api.webp
repo: "https://github.com/DucLong06/ocr-api"
stack:
  - Python
  - FastAPI
  - "Vietnamese OCR"
  - Docker
  - Nginx
featured: true
category: backend
publishedAt: 2023-05-01
---

## Overview

A deployable OCR REST API for Vietnamese documents, distilling hands-on knowledge from building AX-OCR at Cyber Eye Technology into an open-source service.

## Features

- **Document field extraction** — structured JSON output for ID cards, forms, and printed documents.
- **FastAPI backend** — async request handling, OpenAPI docs auto-generated.
- **Docker-first** — single `docker-compose up` for local and production deployment.
- **Nginx reverse proxy** — SSL termination and rate limiting out of the box.

## Background

Built after 3 years on the AX-OCR core team (Sao Khuê Award 2022), this project packages proven Vietnamese OCR post-processing techniques — text segmentation, regex normalisation, and handwriting correction heuristics — into a portable service.
