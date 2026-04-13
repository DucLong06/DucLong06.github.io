---
title: "ALQAC 2023 — Legal QA System"
summary:
  en: "1st-prize system for the ALQAC 2023 Vietnamese legal question answering competition at IEEE KSE."
  vi: "Hệ thống đoạt giải nhất cuộc thi hỏi đáp pháp luật tiếng Việt ALQAC 2023 tại hội nghị IEEE KSE."
cover: /covers/alqac-2023.webp
repo: "https://github.com/DucLong06/ALQAC2023"
stack:
  - Python
  - LLM
  - "Vietnamese NLP"
  - "Information Retrieval"
featured: true
category: research
publishedAt: 2023-10-15
---

## Overview

End-to-end system built for the Automated Legal Question Answering Competition (ALQAC) 2023, Task 2 — achieving **1st Prize** at the IEEE KSE International Conference.

## System Design

1. **Retrieval** — BM25 + dense retrieval over the Vietnamese legal corpus to surface relevant articles.
2. **Re-ranking** — cross-encoder re-ranker to filter top-k candidates.
3. **Answer generation** — LLM with legal-tuned prompts (see Legal-Prompts repo) producing final answers.

## Research Output

This work led to a **1st-author IEEE paper** presented at KSE 2023:
> *"Legal Question Answering Using Large Language Models"* — [ieeexplore.ieee.org/document/10299426](https://ieeexplore.ieee.org/document/10299426)

Research conducted during exchange at **JAIST, Nguyen Lab** (Jun–Aug 2023).
