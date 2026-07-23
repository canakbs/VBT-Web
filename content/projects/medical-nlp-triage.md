---
title: "Clinical NLP Triage & Diagnostic Assistant"
stage: "Deployment"
category: "Natural Language Processing"
github: "https://github.com/akdeniz-veri/medical-nlp"
stats: "Accuracy: 95.2%, F1-Score: 0.94"
summary: "A domain-adapted BERT model trained on Turkish clinical notes to assist triage personnel in prioritizing emergency department patient admissions."
tags: ["BERT", "NLP", "PyTorch", "FastAPI"]
---

### Project Architecture

Emergency departments often face severe bottlenecks due to manual triage sorting. This project builds a privacy-preserving Turkish NLP pipeline for clinical text classification.

### Pipeline Stages

1. **Idea**: Conceived during our 2025 Med-AI hackathon in collaboration with university hospital physicians.
2. **Research**: Fine-tuned BERT-base-turkish on anonymized clinical intake notes and medical terminology.
3. **Development**: Built a lightweight FastAPI microservice with streaming latency under 30ms per record.
4. **Deployment**: Successfully piloted in local healthcare clinics with multi-class risk scoring.
