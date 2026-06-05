---
title: "TechLeague — Engineering Tournament Platform"
summary:
  en: "Full-stack platform running competitive tech tournaments — team management, live match scoring, and a public standings site at techleague.net."
  vi: "Nền tảng full-stack tổ chức giải đấu công nghệ — quản lý đội, chấm điểm trận đấu trực tiếp và trang xếp hạng công khai tại techleague.net."
cover: /covers/techleague.webp
demo: "https://techleague.net"
stack:
  - TypeScript
  - React
  - Node.js
  - PostgreSQL
  - Docker
featured: true
category: web
publishedAt: 2026-05-01
private: true
---

## Overview

TechLeague is a production platform for organising and broadcasting competitive engineering tournaments — from team registration through live match scoring to public, real-time standings.

## Features

- **Team & roster management** — sign-ups, player profiles, and seeding.
- **Live match scoring** — operators update scores in real time; standings recompute instantly.
- **Public standings site** — a fast, shareable leaderboard at [techleague.net](https://techleague.net).
- **Admin tooling** — bracket generation, schedule management, and result reconciliation.

## Stack

- **Frontend**: React + TypeScript SPA, optimised for live updates.
- **Backend**: Node.js API with PostgreSQL for durable tournament state.
- **Infra**: Dockerised services behind a reverse proxy.

> The technical write-up below is pulled automatically from the project's private README at build time once the repository is connected.
