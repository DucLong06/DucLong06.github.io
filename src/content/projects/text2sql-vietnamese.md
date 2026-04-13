---
title: "Text2SQL Vietnamese"
summary:
  en: "Natural language to SQL query translation for Vietnamese, addressing the unique morphological and syntactic challenges of the Vietnamese language."
  vi: "Chuyển đổi câu hỏi tiếng Việt thành truy vấn SQL, xử lý các thách thức đặc thù về hình thái và cú pháp của tiếng Việt."
cover: /covers/text2sql-vietnamese.webp
repo: "https://github.com/DucLong06/Text2SQL-Vietnamese"
stack:
  - Python
  - LLM
  - "Vietnamese NLP"
  - SQL
featured: true
category: ai-ml
publishedAt: 2024-03-01
---

## Overview

A Text-to-SQL system tailored for Vietnamese natural language queries — a low-resource language with distinct tonal and word-boundary characteristics that challenge standard NLP pipelines.

## Challenges Addressed

- Vietnamese lacks whitespace-delimited word boundaries; tokenisation requires dedicated tools.
- Technical database terminology often mixed with Vietnamese phrasing.
- Limited Vietnamese Text2SQL training corpora available publicly.

## Approach

- Fine-tuned LLM with Vietnamese SQL-focused instruction dataset.
- Schema-linking module to map Vietnamese entity mentions to database columns.
- Post-processing to validate generated SQL syntax before execution.
- Evaluated on custom Vietnamese NL2SQL benchmark derived from real-world business schemas.
