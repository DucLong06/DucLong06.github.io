---
title: "Theatre Ticket Booking — booking.duongcam.art"
summary:
  en: "Live production ticket booking platform for a theatre company, with 9Pay payment integration and real revenue."
  vi: "Nền tảng đặt vé trực tuyến cho đoàn nghệ thuật, tích hợp thanh toán 9Pay, đang hoạt động thực tế với doanh thu thật."
cover: /covers/booking-duongcam-art.webp
demo: "https://booking.duongcam.art"
stack:
  - Vue3
  - Django
  - 9Pay
  - PostgreSQL
  - Docker
  - Nginx
featured: true
category: web
publishedAt: 2023-08-01
---

## Overview

Full-stack ticket booking platform built for a Vietnamese theatre company, live in production with real customers and revenue.

## Features

- **Seat selection UI** — interactive hall map, real-time availability via WebSocket.
- **9Pay integration** — Vietnamese payment gateway with callback verification and order reconciliation.
- **Admin dashboard** — event management, ticket inventory, sales reports.
- **Responsive design** — mobile-first Vue3 SPA; works on low-bandwidth connections common in VN.

## Stack

- **Frontend**: Vue3 + TailwindCSS, deployed as static assets via Nginx.
- **Backend**: Django REST Framework, PostgreSQL, background tasks with Celery.
- **Infra**: Docker Compose on VPS; Nginx reverse proxy with SSL termination.
