
---

# `AGENT_NOTES.md`

```md
# Agent Notes for GateFlow ALU

## 1. Purpose

This document provides guidance for AI coding agents and human contributors working on this repository.

The main goal is to help the project grow in a controlled, reliable way.

This repository is specification-first.
Before implementing features, read:

- `README.md`
- `SPEC.md`
- `TASKS.md`
- `ACCEPTANCE.md`
- `ARCHITECTURE.md`

---

## 2. Primary mission

Build the MVP only.

The MVP is:

- a local web app
- based on React + TypeScript + Vite
- visualizing a **1-bit full adder**
- with inputs `A`, `B`, `Cin`
- with outputs `Sum`, `Cout`
- with moving signal dots on wires
- with Primitive and Optimized circuit modes
- with play / pause / reset / step controls
- with speed control
- with a gate details panel
- with an event log

Do not implement the entire ALU in the first pass.

---

## 3. What to prioritize

Prioritize these things in order:

1. correctness of full adder behavior
2. clear separation of architecture
3. visible signal propagation
4. actual graph switching between circuit modes
5. readable and maintainable code

If there is a tradeoff, prefer correctness and modularity over visual polish.

---

## 4. What not to do

Do not:

- add a backend
- add authentication
- add persistence
- implement subtraction or multiplication
- implement a full multi-operation ALU immediately
- add many speculative features
- replace architecture with a monolithic single file
- implement mode switching as a cosmetic-only change
- over-engineer the project for hypothetical future needs

---

## 5. Scope boundaries

### In scope for MVP
- 1-bit full adder
- Primitive mode
- Optimized mode
- SVG circuit rendering
- discrete-event simulation
- moving dots on wires
- playback controls
- gate selection details
- event log
- local browser execution

### Out of scope for MVP
- 4-bit ripple-carry adder
- NOR-only mode
- additional ALU operations
- save/load
- collaboration
- user accounts
- cloud sync
- audio features

These may be added later, but they are not part of the first implementation.

---

## 6. Implementation style guidance

### 6.1 Keep files small and focused
Prefer multiple clear files over one oversized file.

### 6.2 Keep simulation logic separate from UI
The simulation engine should be testable without React.

### 6.3 Keep rendering separate from logic
The SVG renderer should consume state, not compute gate logic.

### 6.4 Prefer explicit code over magical abstractions
This is an educational project.
Clarity matters.

### 6.5 Build extension points naturally
Make it easy to add more circuits later, but do not build those circuits yet.

---

## 7. Recommended work sequence

When implementing from scratch, use this order:

### Phase 1
Project bootstrap only:
- create Vite + React + TypeScript app
- create folder structure
- ensure the app runs locally

### Phase 2
Static circuit rendering:
- define shared types
- define Primitive and Optimized full adder circuit graphs
- render them statically with SVG

### Phase 3
Simulation core:
- implement gate evaluation
- implement event scheduling
- implement propagation timing
- verify Sum/Cout correctness

### Phase 4
Animation and interaction:
- moving signal dots
- playback controls
- speed control
- gate details
- event log

### Phase 5
Cleanup:
- refactor
- document
- ensure acceptance criteria are satisfied

---

## 8. Commit guidance

Prefer small, reviewable commits.

Examples:
- `chore: bootstrap vite react typescript app`
- `feat: add primitive and optimized full adder circuit definitions`
- `feat: implement discrete event simulation core`
- `feat: render animated signal dots in svg wires`
- `feat: add playback controls and event log`

Avoid giant mixed-purpose commits when possible.

---

## 9. Acceptance gate

A task is not complete unless it moves the repository toward the conditions in `ACCEPTANCE.md`.

At minimum, before calling the MVP complete, ensure:

- the app runs locally
- a full adder is visible
- inputs can be changed
- Sum and Cout are correct
- signals visibly propagate
- Primitive and Optimized modes differ structurally
- playback controls work

---

## 10. Guidance for autonomous agents

If you are running autonomously:

- work in small phases
- stop after a coherent milestone
- leave the repository in a runnable state
- update documentation if the implementation structure changes
- do not silently expand scope
- do not replace existing project intent with your own assumptions

If uncertain, prefer a smaller implementation that clearly satisfies the MVP over a larger unstable implementation.

---

## 11. If you must choose between speed and reliability

Choose reliability.

This repository is intended to support educational visualization and future iteration.
A stable, understandable foundation is more valuable than a rushed feature-heavy prototype.

---

## 12. Human review expectations

Human reviewers are likely to care about:

- whether the architecture matches `ARCHITECTURE.md`
- whether the project actually stays within MVP scope
- whether the graph switching is real
- whether the simulation is understandable
- whether the visuals make signal propagation easy to follow

Optimize for reviewability.

---

## 13. Preferred first deliverable

The preferred first deliverable is not the complete final app.

The preferred first deliverable is:

- a runnable app scaffold
- shared types
- two full adder circuit definitions
- a static SVG renderer
- a clean architecture skeleton

Once that exists, build the simulation and animation incrementally.

---

## 14. Final reminder

The project is successful if it makes learners feel:

"I can see how the computation flows through the logic gates."

Keep that goal central in every implementation decision.
