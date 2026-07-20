---
title: "Real-time Traffic Flow Optimisation"
stage: "Deployment"
category: "Machine Learning & Reinforcement Learning"
github: "https://github.com/akdeniz-veri/traffic-flow"
stats: "Congestion Reduction: 22%, Latency: <50ms"
summary: "A reinforcement learning agent that optimizes traffic light timing configurations dynamically based on real-time vehicle flow metrics."
tags: ["Deep Q-Networks","SUMO Simulation","Python"]
---

### Project Architecture

In urban centers, rigid pre-programmed traffic lights aggravate peak-hour congestion. This project uses reinforcement learning to build adaptive signal controllers.

### Pipeline Stages

1. **Idea**: Initiated as a research question on reducing carbon emissions from idling vehicles at major intersections.
2. **Research**: Studied multi-agent reinforcement learning methods and configured the SUMO (Simulation of Urban MObility) environment.
3. **Development**: Currently training Deep Q-Networks (DQN) with reward functions based on total waiting time and queue length.
4. **Deployment**: Planned deployment on a simulator mimicking the Antalya city center grid before piloting with municipal hardware.

### Simulation Performance

Current test runs show a 22% improvement in vehicle flow throughput compared to traditional fixed-time schedulers.
