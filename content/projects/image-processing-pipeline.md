---
title: "Autonomous Drone Vision Pipeline"
stage: "Deployment"
category: "Computer Vision"
github: "https://github.com/akdeniz-veri/drone-vision"
stats: "FPS: 60 (Jetson Nano), Precision: 94%"
summary: "An edge-computed computer vision pipeline enabling autonomous micro-drones to survey agricultural fields and identify crop anomalies without internet connectivity."
image: "/images/hero/coding.png"
tags: ["YOLOv8", "TensorRT", "C++", "ROS2"]
---

### Project Architecture

This project was developed by our Computer Vision and MLOps departments to solve precision agricultural challenges in Antalya's greenhouses.

### Pipeline Stages

1. **Idea**: Formulated during the 2025 agricultural summit to help local farmers reduce pesticide usage by targeting specific sick plants rather than entire crops.
2. **Research**: Evaluated lightweight vision architectures (YOLOv8-nano, MobileNetV4) for low-power ARM devices.
3. **Development**: Wrote ROS2 nodes in C++ and optimized model weights using NVIDIA TensorRT for real-time edge processing.
4. **Deployment**: Deployed on a custom-built quadcopter platform, achieving steady 60 frames per second on a Jetson Nano.

### Field Impact

During testing at the Akdeniz University Agricultural Research Station, the drone successfully mapped a 10-hectare plot in 15 minutes, localizing leaf rust infections with pinpoint coordinate logs.
