---
title: "Face Detection ML System"
summary:
  en: "Production-grade YOLOv11 face detection deployed on GKE with full MLOps observability — CI/CD, auto-scaling, and Prometheus/Grafana monitoring."
  vi: "Pipeline MLOps triển khai YOLOv11 phát hiện khuôn mặt trên GKE với CI/CD, tự động scale và monitoring đầy đủ."
cover: /covers/face-detection-ml-system.webp
repo: "https://github.com/DucLong06/face-detection-ml-system"
stack:
  - Python
  - YOLOv11
  - Kubernetes
  - GKE
  - Docker
  - Prometheus
  - Grafana
  - "GitHub Actions"
featured: true
stars: 38
category: ai-ml
publishedAt: 2024-11-20
---

## Architecture

End-to-end MLOps pipeline for real-time face detection, auto-deployed to Google Kubernetes Engine.

```
Image/Video Input
      │
  YOLOv11 Inference (Python · FastAPI)
      │
  Kubernetes Service (GKE)
  ├── HPA — auto-scales on CPU/memory
  ├── Prometheus — metrics scraping
  └── Grafana — dashboards + alerts
      │
  GitHub Actions CI/CD
  └── Docker build → push GCR → rolling deploy
```

## Key Features

- **YOLOv11** model fine-tuned for face detection; served via FastAPI container.
- **GKE deployment** with Horizontal Pod Autoscaler for traffic spikes.
- **Prometheus + Grafana** stack for latency, throughput, and error-rate dashboards.
- **GitHub Actions** pipeline: lint → test → Docker build → push to GCR → `kubectl rollout`.
- CPU-optimised inference path; GPU node pool optional via node selector.

## Why It Matters

Demonstrates the full production ML lifecycle — not just model training but operationalisation: versioned artifacts, rolling deploys, observability, and auto-recovery from pod failures.
